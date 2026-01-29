import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { getDuration, isSameDay, getISOWeek, buildTimeline } from "../utils/time";

const MAX_SECONDS = 8 * 3600; // 8 horas

export function useClock() {
    const { user } = useAuth();

    const [activeSession, setActiveSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [elapsed, setElapsed] = useState(0); // tiempo del intervalo activo
    const [elapsedSession, setElapsedSession] = useState(0); // 🔥 NUEVO: tiempo total acumulado
    const [sessions, setSessions] = useState([]);
    const [animate, setAnimate] = useState(false);

    // ------------------------------------------------------------
    // FETCH DE TODAS LAS SESIONES
    // ------------------------------------------------------------
    const fetchActiveSession = async () => {
        setLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch("http://localhost:8080/me/sessions", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setSessions(data);

            // Encontrar la sesión activa (sin EndTime)
            const open = data.find((s) => !s.EndTime);
            setActiveSession(open || null);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------
    // ACCIONES
    // ------------------------------------------------------------
    const startSession = async () => {
        setActionLoading(true);
        try {
            const token = await user.getIdToken();
            await fetch("http://localhost:8080/me/sessions/start", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchActiveSession();
        } finally {
            setActionLoading(false);
        }
    };

    const endSession = async () => {
        setActionLoading(true);
        try {
            const token = await user.getIdToken();
            await fetch("http://localhost:8080/me/sessions/end", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchActiveSession();
        } finally {
            setActionLoading(false);
        }
    };

    const pauseSession = async () => {
        setActionLoading(true);
        try {
            const token = await user.getIdToken();
            await fetch("http://localhost:8080/me/sessions/pause", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchActiveSession();
        } finally {
            setActionLoading(false);
        }
    };

    const resumeSession = async () => {
        setActionLoading(true);
        try {
            const token = await user.getIdToken();
            await fetch("http://localhost:8080/me/sessions/resume", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchActiveSession();
        } finally {
            setActionLoading(false);
        }
    };

    // ------------------------------------------------------------
    // INTERVALO ACTIVO
    // ------------------------------------------------------------
    const activeInterval = useMemo(() => {
        return activeSession?.Intervals?.find((i) => !i.EndTime) || null;
    }, [activeSession]);

    // ------------------------------------------------------------
    // TIMER DEL INTERVALO ACTIVO
    // ------------------------------------------------------------
    useEffect(() => {
        let interval;

        if (activeInterval) {
            const start = new Date(activeInterval.StartTime);

            setElapsed(Math.floor((Date.now() - start.getTime()) / 1000));

            interval = setInterval(() => {
                setElapsed(Math.floor((Date.now() - start.getTime()) / 1000));
            }, 1000);
        } else {
            // No hay intervalo activo → contador detenido
            setElapsed(0);
        }

        return () => clearInterval(interval);
    }, [activeInterval]);

    // ------------------------------------------------------------
    // 🔥 TIEMPO TOTAL DE LA SESIÓN (ACTUALIZADO CADA SEGUNDO)
    // ------------------------------------------------------------
    useEffect(() => {
        const updateElapsedSession = () => {
            if (!activeSession || !Array.isArray(activeSession.Intervals)) {
                setElapsedSession(0);
                return;
            }

            const total = activeSession.Intervals.reduce((acc, interval) => {
                const start = new Date(interval.StartTime);
                const end = interval.EndTime ? new Date(interval.EndTime) : new Date();

                if (isNaN(start.getTime()) || isNaN(end.getTime())) return acc;

                const duration = getDuration(start, end);
                return isNaN(duration) ? acc : acc + duration;
            }, 0);

            setElapsedSession(total);
        };

        updateElapsedSession(); // inicial
        const interval = setInterval(updateElapsedSession, 1000);

        return () => clearInterval(interval);
    }, [activeSession]);

    // ------------------------------------------------------------
    // INIT
    // ------------------------------------------------------------
    useEffect(() => {
        fetchActiveSession();
    }, []);

    useEffect(() => {
        setAnimate(true);
    }, []);

    // ------------------------------------------------------------
    // CÁLCULOS DE TIEMPO (SE MANTIENEN IGUAL)
    // ------------------------------------------------------------
    const now = new Date();

    let totalToday = 0;
    let totalWeek = 0;
    let totalMonth = 0;
    let lastSession = null;

    sessions.forEach((s) => {
        const start = new Date(s.StartTime);
        const end = s.EndTime ? new Date(s.EndTime) : now;
        const duration = getDuration(start, end);

        if (!lastSession || new Date(s.StartTime) > new Date(lastSession.StartTime)) {
            lastSession = s;
        }

        if (isSameDay(start, now)) {
            totalToday += duration;
        }

        if (getISOWeek(start) === getISOWeek(now)) {
            totalWeek += duration;
        }

        if (
            start.getFullYear() === now.getFullYear() &&
            start.getMonth() === now.getMonth()
        ) {
            totalMonth += duration;
        }
    });

    // TIMELINES
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayEnd = todayStart + 24 * 3600 * 1000;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // lunes
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = weekStart.getTime() + 7 * 24 * 3600 * 1000;

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

    const intervals = sessions.flatMap(s => s.Intervals);

    const timelineToday = buildTimeline(intervals, todayStart, todayEnd);
    const timelineWeek = buildTimeline(intervals, weekStart.getTime(), weekEnd);
    const timelineMonth = buildTimeline(intervals, monthStart, monthEnd);

    // Ticks de la timeline
    function buildTicksForDay() {
        const ticks = [];
        for (let h = 0; h <= 24; h += 6) {
            ticks.push({
                label: `${h}h`,
                offset: (h / 24) * 100,
            });
        }
        return ticks;
    }

    function buildTicksForWeek() {
        const labels = ["L", "M", "X", "J", "V", "S", "D"];
        return labels.map((label, i) => ({
            label,
            offset: (i / 7) * 100,
        }));
    }

    function buildTicksForMonth() {
        const ticks = [];
        for (let w = 0; w < 5; w++) {
            ticks.push({
                label: `Semana ${w + 1}`,
                offset: (w / 5) * 100,
            });
        }
        return ticks;
    }
    // ----------------------

    const rawProgress = (elapsed / MAX_SECONDS) * 100;
    const progress = Math.min(Math.max(rawProgress, 1), 100);

    // ------------------------------------------------------------
    // ESTADO DE LA SESIÓN
    // ------------------------------------------------------------
    const sessionStatus = useMemo(() => {
        if (!activeSession) return "inactive";
        return activeInterval ? "active" : "paused";
    }, [activeSession, activeInterval]);


    return {
        loading,
        activeSession,
        activeInterval,
        elapsed,
        elapsedSession, // 🔥 AHORA FUNCIONA EN TIEMPO REAL
        progress,
        actionLoading,
        startSession,
        endSession,
        pauseSession,
        resumeSession,
        totalToday,
        totalWeek,
        totalMonth,
        lastSession,
        animate,
        sessionStatus,
        timelineToday,
        timelineWeek,
        timelineMonth,
        ticksToday: buildTicksForDay(),
        ticksWeek: buildTicksForWeek(),
        ticksMonth: buildTicksForMonth(),
        intervals,
        weekStart: weekStart.getTime(),
        weekEnd,
        monthStart,
        monthEnd,
        todayStart,
        todayEnd,
    };
}
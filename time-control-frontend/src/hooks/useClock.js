// src/hooks/useClock.js
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
    getDuration,
    isSameDay,
    getISOWeek,
} from "../utils/time";

const MAX_SECONDS = 8 * 3600; // 8 horas

export function useClock() {
    const { user } = useAuth();

    const [activeSession, setActiveSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [animate, setAnimate] = useState(false);

    const fetchActiveSession = async () => {
        setLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch("http://localhost:8080/me/sessions", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            setSessions(data);
            const open = data.find((s) => !s.EndTime);
            setActiveSession(open || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        let interval;

        if (activeSession) {
            const start = new Date(activeSession.StartTime);

            setElapsed(Math.floor((Date.now() - start.getTime()) / 1000));

            interval = setInterval(() => {
                setElapsed(Math.floor((Date.now() - start.getTime()) / 1000));
            }, 1000);
        } else {
            setElapsed(0);
        }

        return () => clearInterval(interval);
    }, [activeSession]);

    useEffect(() => {
        fetchActiveSession();
    }, []);

    useEffect(() => {
        setAnimate(true);
    }, []);

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

    const rawProgress = (elapsed / MAX_SECONDS) * 100;
    const progress = Math.min(Math.max(rawProgress, 1), 100);

    return {
        loading,
        activeSession,
        elapsed,
        progress,
        actionLoading,
        startSession,
        endSession,
        totalToday,
        totalWeek,
        totalMonth,
        lastSession,
        animate,
    };
}
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Paper,
    Grid
} from "@mui/material";
import { Today, DateRange, CalendarMonth } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function getProgressColor(seconds) {
    if (seconds < 4 * 3600) return "success.main";
    if (seconds < 6 * 3600) return "warning.main";
    return "error.main";
}

function getDuration(start, end) {
    return Math.floor((end - start) / 1000);
}

function isSameDay(a, b) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function getISOWeek(date) {
    const temp = new Date(date.getTime());
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const week1 = new Date(temp.getFullYear(), 0, 4);
    return (
        1 +
        Math.round(
            ((temp.getTime() - week1.getTime()) / 86400000 -
                3 +
                ((week1.getDay() + 6) % 7)) /
            7
        )
    );
}

export default function Clock() {
    const { user } = useAuth();
    const [activeSession, setActiveSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [sessions, setSessions] = useState([]);

    const MAX_SECONDS = 8 * 3600; // 8 horas
    const rawProgress = (elapsed / MAX_SECONDS) * 100;
    const progress = Math.min(Math.max(rawProgress, 1), 100);

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

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

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

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Fichar
            </Typography>

            <Paper sx={{ p: 3, textAlign: "center" }}>
                {activeSession ? (
                    <>
                        <Typography sx={{ mb: 1 }}>
                            Sesión iniciada a las:{" "}
                            <strong>
                                {new Date(activeSession.StartTime).toLocaleString()}
                            </strong>
                        </Typography>

                        <Box
                            sx={{
                                position: "relative",
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mb: 3,
                            }}
                        >
                            <CircularProgress
                                variant="determinate"
                                value={100}
                                size={140}
                                thickness={4}
                                sx={{ color: "grey.300", position: "absolute" }}
                            />

                            <CircularProgress
                                variant="determinate"
                                value={progress}
                                size={140}
                                thickness={4}
                                sx={{ color: getProgressColor(elapsed) }}
                            />

                            <Box
                                sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: "absolute",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.3rem",
                                    fontWeight: 600,
                                }}
                            >
                                {formatDuration(elapsed)}
                            </Box>
                        </Box>

                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Button
                                variant="contained"
                                color="error"
                                size="large"
                                onClick={endSession}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Finalizando..." : "Finalizar jornada"}
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography sx={{ mb: 2 }}>No hay sesión activa</Typography>

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={startSession}
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Iniciando..." : "Iniciar jornada"}
                        </Button>
                    </>
                )}
                <Box sx={{ mt: 4, textAlign: "center" }}>
                    <Typography sx={{ fontWeight: 600, mb: 2 }}>
                        Resumen
                    </Typography>

                    <Grid container spacing={2} justifyContent="center">
                        {/* Tarjeta Día */}
                        <Grid item xs={12} sm={4} md={3}>
                            <Paper sx={{ p: 2, textAlign: "center" }}>
                                <Today sx={{ fontSize: 32, color: "primary.main" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                                    Hoy
                                </Typography>
                                <Typography variant="h6">{formatDuration(totalToday)}</Typography>
                            </Paper>
                        </Grid>

                        {/* Tarjeta Semana */}
                        <Grid item xs={12} sm={4} md={3}>
                            <Paper sx={{ p: 2, textAlign: "center" }}>
                                <DateRange sx={{ fontSize: 32, color: "primary.main" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                                    Semana
                                </Typography>
                                <Typography variant="h6">{formatDuration(totalWeek)}</Typography>
                            </Paper>
                        </Grid>

                        {/* Tarjeta Mes */}
                        <Grid item xs={12} sm={4} md={3}>
                            <Paper sx={{ p: 2, textAlign: "center" }}>
                                <CalendarMonth sx={{ fontSize: 32, color: "primary.main" }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                                    Mes
                                </Typography>
                                <Typography variant="h6">{formatDuration(totalMonth)}</Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Última sesión y estado */}
                    <Box sx={{ mt: 3 }}>
                        <Typography sx={{ mb: 1 }}>
                            Última sesión:{" "}
                            {lastSession
                                ? new Date(lastSession.StartTime).toLocaleString()
                                : "—"}
                        </Typography>

                        <Typography>
                            Estado actual:{" "}
                            <strong style={{ color: activeSession ? "green" : "red" }}>
                                {activeSession ? "En jornada" : "Fuera de jornada"}
                            </strong>
                        </Typography>
                    </Box>
                </Box>

            </Paper>
        </Box>
    );
}

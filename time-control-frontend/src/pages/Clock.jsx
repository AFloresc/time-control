import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Paper,
} from "@mui/material";
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

export default function Clock() {
    const { user } = useAuth();
    const [activeSession, setActiveSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [elapsed, setElapsed] = useState(0);

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

                        {/* Círculo de progreso */}
                        <Box
                            sx={{
                                position: "relative",
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                                mb: 3,
                            }}
                        >
                            {/* Fondo gris */}
                            <CircularProgress
                                variant="determinate"
                                value={100}
                                size={140}
                                thickness={4}
                                sx={{ color: "grey.300", position: "absolute" }}
                            />

                            {/* Progreso azul */}
                            <CircularProgress
                                variant="determinate"
                                value={progress}
                                size={140}
                                thickness={4}
                                sx={{ color: getProgressColor(elapsed) }}
                            />

                            {/* Texto en el centro */}
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
                        <Box sx={{ textAlign: "center" }}>
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
            </Paper>
        </Box>
    );
}
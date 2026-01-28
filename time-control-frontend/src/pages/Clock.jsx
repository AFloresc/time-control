import { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, Paper } from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function Clock() {
    const { user } = useAuth();
    const [activeSession, setActiveSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchActiveSession = async () => {
        setLoading(true);
        try {
            const token = await user.getIdToken();
            const res = await fetch("http://localhost:8080/me/sessions", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            // Buscar sesión sin EndTime
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
                        <Typography sx={{ mb: 2 }}>
                            Sesión iniciada a las:{" "}
                            <strong>{new Date(activeSession.StartTime).toLocaleString()}</strong>
                        </Typography>

                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={endSession}
                            disabled={actionLoading}
                        >
                            {actionLoading ? "Finalizando..." : "Finalizar jornada"}
                        </Button>
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
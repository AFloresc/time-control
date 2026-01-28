import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export default function Sessions() {
    const { user } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = await user.getIdToken();

                const res = await fetch("http://localhost:8080/me/sessions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || "Error al obtener las sesiones");
                }

                const data = await res.json();
                setSessions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [user]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && sessions.length === 0) {
        return (
            <Typography sx={{ mt: 3, opacity: 0.7 }}>
                No hay sesiones registradas todavía.
            </Typography>
        );
    }


    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Mis sesiones
            </Typography>

            <TableContainer component={Paper} elevation={1}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Inicio</strong></TableCell>
                            <TableCell><strong>Fin</strong></TableCell>
                            <TableCell><strong>Duración</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {sessions.map((s) => {
                            const start = new Date(s.start_time);
                            const end = s.end_time ? new Date(s.end_time) : null;

                            const duration = end
                                ? Math.round((end - start) / 60000) + " min"
                                : "En curso";

                            return (
                                <TableRow key={s.id}>
                                    <TableCell>{start.toLocaleString()}</TableCell>
                                    <TableCell>{end ? end.toLocaleString() : "—"}</TableCell>
                                    <TableCell>{duration}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
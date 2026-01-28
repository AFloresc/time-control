import {
    Box,
    Typography,
    Grid,
    Paper,
} from "@mui/material";
import { Fade, Slide } from "@mui/material";
import { Today, DateRange, CalendarMonth } from "@mui/icons-material";
import { formatDuration } from "../../utils/time";

export default function ClockSummaryStatus({
    animate,
    totalToday,
    totalWeek,
    totalMonth,
    lastSession,
    activeSession,
}) {
    return (
        <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>Resumen</Typography>

            <Grid container spacing={2} justifyContent="center">

                {/* Hoy */}
                <Grid item xs={12} sm={4} md={3}>
                    <Fade in={animate} timeout={600}>
                        <Slide in={animate} direction="up" timeout={600}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    position: "relative",
                                    overflow: "hidden",
                                    background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
                                    color: "white",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",

                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        inset: 0,
                                        background: "rgba(255, 255, 255, 0.15)",
                                        backdropFilter: "blur(12px)",
                                        WebkitBackdropFilter: "blur(12px)",
                                        borderRadius: 3,
                                        zIndex: 0,
                                        transition: "all 0.3s ease",
                                    },

                                    "&:hover::before": {
                                        background: "rgba(255, 255, 255, 0.22)",
                                        backdropFilter: "blur(16px)",
                                    },

                                    "&:hover": {
                                        transform: "translateY(-6px) scale(1.03)",
                                        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                                    },

                                    "& > *": {
                                        position: "relative",
                                        zIndex: 1,
                                    },
                                }}
                            >
                                <Today sx={{ fontSize: 32 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                                    Hoy
                                </Typography>
                                <Typography variant="h6">
                                    {formatDuration(totalToday)}
                                </Typography>
                            </Paper>
                        </Slide>
                    </Fade>
                </Grid>

                {/* Semana */}
                <Grid item xs={12} sm={4} md={3}>
                    <Fade in={animate} timeout={700}>
                        <Slide in={animate} direction="up" timeout={700}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    position: "relative",
                                    overflow: "hidden",
                                    background: "linear-gradient(135deg, #FDE68A, #F59E0B)",
                                    color: "white",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",

                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        inset: 0,
                                        background: "rgba(255, 255, 255, 0.15)",
                                        backdropFilter: "blur(12px)",
                                        WebkitBackdropFilter: "blur(12px)",
                                        borderRadius: 3,
                                        zIndex: 0,
                                        transition: "all 0.3s ease",
                                    },

                                    "&:hover::before": {
                                        background: "rgba(255, 255, 255, 0.22)",
                                        backdropFilter: "blur(16px)",
                                    },

                                    "&:hover": {
                                        transform: "translateY(-6px) scale(1.03)",
                                        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                                    },

                                    "& > *": {
                                        position: "relative",
                                        zIndex: 1,
                                    },
                                }}
                            >
                                <DateRange sx={{ fontSize: 32 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                                    Semana
                                </Typography>
                                <Typography variant="h6">
                                    {formatDuration(totalWeek)}
                                </Typography>
                            </Paper>
                        </Slide>
                    </Fade>
                </Grid>

                {/* Mes */}
                <Grid item xs={12} sm={4} md={3}>
                    <Fade in={animate} timeout={800}>
                        <Slide in={animate} direction="up" timeout={800}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    position: "relative",
                                    overflow: "hidden",
                                    background: "linear-gradient(135deg, #A78BFA, #6366F1)",
                                    color: "white",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",

                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        inset: 0,
                                        background: "rgba(255, 255, 255, 0.15)",
                                        backdropFilter: "blur(12px)",
                                        WebkitBackdropFilter: "blur(12px)",
                                        borderRadius: 3,
                                        zIndex: 0,
                                        transition: "all 0.3s ease",
                                    },

                                    "&:hover::before": {
                                        background: "rgba(255, 255, 255, 0.22)",
                                        backdropFilter: "blur(16px)",
                                    },

                                    "&:hover": {
                                        transform: "translateY(-6px) scale(1.03)",
                                        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                                    },

                                    "& > *": {
                                        position: "relative",
                                        zIndex: 1,
                                    },
                                }}
                            >
                                <CalendarMonth sx={{ fontSize: 32 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                                    Mes
                                </Typography>
                                <Typography variant="h6">
                                    {formatDuration(totalMonth)}
                                </Typography>
                            </Paper>
                        </Slide>
                    </Fade>
                </Grid>

            </Grid>

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
    );
}

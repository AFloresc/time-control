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
                <Grid item xs={12} sm={4} md={3}>
                    <Fade in={animate} timeout={600}>
                        <Slide in={animate} direction="up" timeout={600}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    background: "linear-gradient(135deg, #6EE7B7, #3B82F6)",
                                    color: "white",
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

                <Grid item xs={12} sm={4} md={3}>
                    <Fade in={animate} timeout={700}>
                        <Slide in={animate} direction="up" timeout={700}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    background: "linear-gradient(135deg, #FDE68A, #F59E0B)",
                                    color: "white",
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

                <Grid item xs={12} sm={4} md={3}>
                    <Fade in={animate} timeout={800}>
                        <Slide in={animate} direction="up" timeout={800}>
                            <Paper
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    background: "linear-gradient(135deg, #A78BFA, #6366F1)",
                                    color: "white",
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
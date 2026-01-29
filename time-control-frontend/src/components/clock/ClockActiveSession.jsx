import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { formatDuration, getProgressColor } from "../../utils/time";

export default function ClockActiveSession({
    activeSession,
    sessionStatus,
    elapsed,          // tiempo del intervalo activo
    elapsedSession,   // tiempo total acumulado de la sesión (nuevo)
    progress,
    actionLoading,
    endSession,
    pauseSession,
    resumeSession,
}) {
    const isPaused = sessionStatus === "paused";

    return (
        <>
            <Typography sx={{ mb: 1 }}>
                Sesión iniciada a las:{" "}
                <strong>{new Date(activeSession.StartTime).toLocaleString()}</strong>
            </Typography>

            {/* CONTADOR DEL INTERVALO ACTIVO */}
            <Box
                sx={{
                    position: "relative",
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 1,
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

            {/* TIEMPO TOTAL DE LA SESIÓN */}
            <Typography sx={{ mb: 3, fontSize: "1rem", opacity: 0.8 }}>
                Tiempo total de la sesión:{" "}
                <strong>{formatDuration(elapsedSession)}</strong>
            </Typography>

            {/* BOTONES */}
            <Box
                sx={{
                    textAlign: "center",
                    mb: 3,
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                }}
            >
                {/* PAUSAR */}
                {!isPaused && (
                    <Button
                        variant="contained"
                        color="warning"
                        size="large"
                        onClick={pauseSession}
                        disabled={actionLoading}
                    >
                        {actionLoading ? "Pausando..." : "Pausar"}
                    </Button>
                )}

                {/* REANUDAR */}
                {isPaused && (
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={resumeSession}
                        disabled={actionLoading}
                    >
                        {actionLoading ? "Reanudando..." : "Reanudar"}
                    </Button>
                )}

                {/* FINALIZAR JORNADA */}
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
    );
}
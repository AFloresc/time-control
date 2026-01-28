import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { formatDuration, getProgressColor } from "../../utils/time";

export default function ClockActiveSession({
    activeSession,
    elapsed,
    progress,
    actionLoading,
    endSession,
}) {
    return (
        <>
            <Typography sx={{ mb: 1 }}>
                Sesión iniciada a las:{" "}
                <strong>{new Date(activeSession.StartTime).toLocaleString()}</strong>
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
    );
}
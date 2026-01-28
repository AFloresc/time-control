import {
    Box,
    Typography,
    Paper,
    CircularProgress,
} from "@mui/material";
import { useClock } from "../hooks/useClock";
import ClockActiveSession from "../components/clock/ClockActiveSession.jsx";
import ClockInactiveSession from "../components/clock/ClockInactiveSession.jsx";
import ClockSummaryStatus from "../components/clock/ClockSummaryStatus.jsx";

export default function Clock() {
    const {
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
    } = useClock();

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
                    <ClockActiveSession
                        activeSession={activeSession}
                        elapsed={elapsed}
                        progress={progress}
                        actionLoading={actionLoading}
                        endSession={endSession}
                    />
                ) : (
                    <ClockInactiveSession
                        actionLoading={actionLoading}
                        startSession={startSession}
                    />
                )}

                <ClockSummaryStatus
                    animate={animate}
                    totalToday={totalToday}
                    totalWeek={totalWeek}
                    totalMonth={totalMonth}
                    lastSession={lastSession}
                    activeSession={activeSession}
                />
            </Paper>
        </Box>
    );
}
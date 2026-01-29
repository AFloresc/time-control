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
import TimelineBar from "../components/TimeLine.jsx";
import TimelineTicks from "../components/timeline/TimelineTicks.jsx";

export default function Clock() {
    const {
        loading,
        activeSession,
        activeInterval,
        elapsed,
        progress,
        actionLoading,
        startSession,
        endSession,
        pauseSession,
        resumeSession,
        totalToday,
        totalWeek,
        totalMonth,
        lastSession,
        animate,
        sessionStatus,
        elapsedSession,
        timelineToday,
        timelineWeek,
        timelineMonth,
        ticksToday,
        ticksWeek,
        ticksMonth,
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
                        activeInterval={activeInterval}
                        sessionStatus={sessionStatus}
                        elapsed={elapsed}
                        progress={progress}
                        actionLoading={actionLoading}
                        endSession={endSession}
                        pauseSession={pauseSession}
                        resumeSession={resumeSession}
                        elapsedSession={elapsedSession}
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
            <Box sx={{ mt: 4, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Hoy</Typography>
                <TimelineBar segments={timelineToday} />
                <TimelineTicks ticks={ticksToday} />
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Semana</Typography>
                <TimelineBar segments={timelineWeek} />
                <TimelineTicks ticks={ticksWeek} />
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Mes</Typography>
                <TimelineBar segments={timelineMonth} />
                <TimelineTicks ticks={ticksMonth} />
            </Box>
        </Box>
    );
}
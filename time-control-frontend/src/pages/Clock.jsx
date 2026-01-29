import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button,
} from "@mui/material";

import { useClock } from "../hooks/useClock";
import ClockActiveSession from "../components/clock/ClockActiveSession.jsx";
import ClockInactiveSession from "../components/clock/ClockInactiveSession.jsx";
import ClockSummaryStatus from "../components/clock/ClockSummaryStatus.jsx";
import TimelineBar from "../components/TimeLine.jsx";
import TimelineTicks from "../components/timeline/TimelineTicks.jsx";
import { buildTimelineForRange } from "../utils/time.js";
import { useState } from "react";

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
        intervals,       // 👈 NECESARIO PARA EL ZOOM
        todayStart,
        todayEnd,
        weekStart,
        weekEnd,
        monthStart,
        monthEnd,
    } = useClock();

    // Estado del zoom
    const [zoom, setZoom] = useState(null);

    // Timeline ampliado
    const zoomedTimeline = zoom
        ? buildTimelineForRange(intervals, zoom.start, zoom.end)
        : null;

    // Lógica del zoom
    const handleZoom = (percent, range) => {
        const start = range.start + (range.end - range.start) * (percent / 100);
        const end = start + (range.end - range.start) * 0.25; // Zoom x4
        setZoom({ start, end });
    };

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
                {/* HOY */}
                <Typography variant="h6" sx={{ mb: 1 }}>Hoy</Typography>
                <TimelineBar
                    segments={timelineToday}
                    ticks={ticksToday}
                    onZoom={(percent) =>
                        handleZoom(percent, { start: todayStart, end: todayEnd })
                    }
                />
                <TimelineTicks ticks={ticksToday} />

                {/* SEMANA */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Semana</Typography>
                <TimelineBar
                    segments={timelineWeek}
                    ticks={ticksWeek}
                    onZoom={(percent) =>
                        handleZoom(percent, { start: weekStart, end: weekEnd })
                    }
                />
                <TimelineTicks ticks={ticksWeek} />

                {/* MES */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Mes</Typography>
                <TimelineBar
                    segments={timelineMonth}
                    ticks={ticksMonth}
                    onZoom={(percent) =>
                        handleZoom(percent, { start: monthStart, end: monthEnd })
                    }
                />
                <TimelineTicks ticks={ticksMonth} />
            </Box>

            {/* ZOOM VIEW */}
            {zoom && (
                <Box sx={{ mt: 4, p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Zoom
                    </Typography>

                    <TimelineBar
                        segments={zoomedTimeline}
                        ticks={[]} // puedes generar ticks dinámicos si quieres
                    />

                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => setZoom(null)}
                    >
                        Volver
                    </Button>
                </Box>
            )}
        </Box>
    );
}
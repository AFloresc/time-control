import { Box } from "@mui/material";
import TimelineSegment from "./timeline/TimelineSegments";
import TimelineTickLines from "./timeline/TimelineTickLines";

export default function TimelineBar({ segments, ticks }) {
    return (
        <Box
            sx={{
                position: "relative",
                height: 12,
                background: "linear-gradient(90deg, #e0e1e1, #9fa19f)",
                borderRadius: 6,
                overflow: "hidden",
                mb: 2,
            }}
        >
            <TimelineTickLines ticks={ticks} />

            {segments.map((segment, i) => (
                <TimelineSegment key={i} segment={segment} />
            ))}
        </Box>
    );
}
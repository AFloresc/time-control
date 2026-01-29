import { Box } from "@mui/material";
import TimelineSegment from "./timeline/TimelineSegments";
import TimelineTickLines from "./timeline/TimelineTickLines";

export default function TimelineBar({ segments, ticks, onZoom }) {
    return (
        <Box
            sx={{
                position: "relative",
                height: 12,
                background: "linear-gradient(90deg, #e0e1e1, #9fa19f)",
                borderRadius: 6,
                overflow: "hidden",
                mb: 2,
                cursor: onZoom ? "pointer" : "default",
            }}
            onClick={(e) => {
                if (!onZoom) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = (x / rect.width) * 100;
                onZoom(percent);
            }}

        >
            <TimelineTickLines ticks={ticks} />

            {segments.map((segment, i) => (
                <TimelineSegment key={i} segment={segment} />
            ))}
        </Box>
    );
}
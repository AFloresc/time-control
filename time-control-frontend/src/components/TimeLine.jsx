import { Box } from "@mui/material";
import TimelineSegment from "./timeline/TimelineSegments";

export default function TimelineBar({ segments }) {
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
            {segments.map((segment, i) => (
                <TimelineSegment key={i} segment={segment} />
            ))}
        </Box>
    );
}
import { Box, Tooltip } from "@mui/material";
import { formatDuration } from "../../utils/time";

export default function TimelineSegment({ segment }) {
    return (
        <Tooltip
            title={
                <>
                    <div><strong>Inicio:</strong> {segment.realStart.toLocaleString()}</div>
                    <div><strong>Fin:</strong> {segment.realEnd.toLocaleString()}</div>
                    <div><strong>Duración:</strong> {formatDuration(segment.duration)}</div>
                </>
            }
            arrow
        >
            <Box
                sx={{
                    position: "absolute",
                    left: `${segment.offset}%`,
                    width: `${segment.width}%`,
                    height: "100%",
                    background:
                        segment.width > 10
                            ? "#4caf50"
                            : "#81c784",
                    borderRadius: 6,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                }}
            />
        </Tooltip>
    );
}
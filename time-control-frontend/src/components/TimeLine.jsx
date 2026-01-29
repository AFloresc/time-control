import { Box } from "@mui/material";

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
                <Box
                    key={i}
                    sx={{
                        position: "absolute",
                        left: `${segment.offset}%`,
                        width: `${segment.width}%`,
                        height: "100%",
                        background:
                            segment.width > 10
                                ? "#4caf50" // verde fuerte para intervalos largos
                                : "#81c784", // verde claro para intervalos cortos
                        borderRadius: 6,
                        transition: "all 0.3s ease",
                    }}
                />
            ))}
        </Box>
    );
}
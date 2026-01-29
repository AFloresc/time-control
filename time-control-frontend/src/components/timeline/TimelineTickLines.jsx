import { Box } from "@mui/material";

export default function TimelineTickLines({ ticks }) {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        >
            {ticks.map((tick, i) => (
                <Box
                    key={i}
                    sx={{
                        position: "absolute",
                        left: `${tick.offset}%`,
                        top: 0,
                        width: "1px",
                        height: "100%",
                        background: "rgba(0,0,0,0.35)",
                        transform: "translateX(-0.5px)",
                    }}
                />
            ))}
        </Box>
    );
}
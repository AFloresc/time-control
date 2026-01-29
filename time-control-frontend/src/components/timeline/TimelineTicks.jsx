import { Box, Typography } from "@mui/material";

export default function TimelineTicks({ ticks }) {
    return (
        <Box
            sx={{
                position: "relative",
                mt: 1,
                height: 20,
            }}
        >
            {ticks.map((tick, i) => (
                <Box
                    key={i}
                    sx={{
                        position: "absolute",
                        left: `${tick.offset}%`,
                        transform: "translateX(-50%)",
                        textAlign: "center",
                    }}
                >
                    <Typography
                        variant="caption"
                        sx={{ fontSize: "0.7rem", color: "#666" }}
                    >
                        {tick.label}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}
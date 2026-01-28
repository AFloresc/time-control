import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#9c27b0',
        },
    },
    typography: {
        fontFamily: "Montserrat, sans-serif",
    },
    components: {
        MuiPaper: {
            variants: [
                {
                    props: { variant: "glassGradientCard" },
                    style: {
                        p: 16,
                        textAlign: "center",
                        borderRadius: 12,
                        position: "relative",
                        overflow: "hidden",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.3s ease",

                        "&::before": {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            background: "rgba(255, 255, 255, 0.15)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            borderRadius: 12,
                            zIndex: 0,
                            transition: "all 0.3s ease",
                        },

                        "&:hover::before": {
                            background: "rgba(255, 255, 255, 0.22)",
                            backdropFilter: "blur(16px)",
                        },

                        "&:hover": {
                            transform: "translateY(-6px) scale(1.03)",
                            boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                        },

                        "& > *": {
                            position: "relative",
                            zIndex: 1,
                        },
                    },
                },
            ],
        },
    },
});

export default theme;
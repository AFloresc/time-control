import { Box, Typography, Button } from "@mui/material";

export default function ClockInactiveSession({
    actionLoading,
    startSession,
}) {
    return (
        <>
            <Typography sx={{ mb: 2 }}>No hay sesión activa</Typography>

            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={startSession}
                disabled={actionLoading}
            >
                {actionLoading ? "Iniciando..." : "Iniciar jornada"}
            </Button>
        </>
    );
}
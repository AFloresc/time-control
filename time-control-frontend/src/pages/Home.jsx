import { Container, Typography } from "@mui/material";

export default function Home() {
    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Bienvenido al panel de control
            </Typography>

            <Typography variant="body1">
                Ya estás autenticado. Aquí mostraremos tus sesiones, fichajes y más.
            </Typography>
        </Container>
    );
}
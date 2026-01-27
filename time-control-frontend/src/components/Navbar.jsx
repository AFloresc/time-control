import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar({ onMenuClick }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    return (
        <AppBar position="static" elevation={1}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                {/* Left side */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton color="inherit" onClick={onMenuClick}>
                        <MenuIcon />

                    </IconButton>

                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Time Control
                    </Typography>
                </Box>

                {/* Right side */}
                {user && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {user.email}
                        </Typography>

                        <Button
                            color="inherit"
                            variant="outlined"
                            onClick={handleLogout}
                            sx={{
                                borderColor: "rgba(255,255,255,0.5)",
                                "&:hover": { borderColor: "white" },
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
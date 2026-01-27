import { Drawer, List, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
    const navigate = useNavigate();

    const menuItems = [
        { label: "Inicio", path: "/" },
        { label: "Mis sesiones", path: "/sessions" },
        { label: "Fichar", path: "/clock" },
        // más rutas en el futuro
    ];

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <Toolbar /> {/* Para empujar el contenido debajo de la navbar */}
            <List sx={{ width: 250 }}>
                {menuItems.map((item) => (
                    <ListItemButton key={item.path} onClick={() => handleNavigate(item.path)}>
                        <ListItemText primary={item.label} />
                    </ListItemButton>
                ))}
            </List>
        </Drawer>
    );
}
import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Divider,
    ListItemIcon
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PunchClockIcon from "@mui/icons-material/PunchClock";


export default function Sidebar({ open, onClose }) {
    const navigate = useNavigate();

    const menuItems = [
        { label: "Inicio", path: "/", icon: <HomeOutlinedIcon /> },
        { label: "Mis sesiones", path: "/sessions", icon: <AccessTimeOutlinedIcon /> },
        { label: "Fichar", path: "/clock", icon: <PunchClockIcon /> },
        // más rutas en el futuro
    ];

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <Toolbar /> {/* Espacio para la navbar */}
            <List sx={{ width: 260 }}>
                {menuItems.map((item) => (
                    <ListItemButton key={item.path} onClick={() => handleNavigate(item.path)}>
                        <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />

                    </ListItemButton>
                ))}

                <Divider sx={{ my: 1 }} />

                {/* Sección futura para admin */}
                {/* 
        <ListItemButton onClick={() => handleNavigate("/admin")}>
          <ListItemIcon><AdminPanelSettingsOutlinedIcon /></ListItemIcon>
          <ListItemText primary="Admin" />
        </ListItemButton>
        */}
            </List>
        </Drawer>
    );
}

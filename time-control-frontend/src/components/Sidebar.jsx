import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: "Inicio", path: "/", icon: <HomeOutlinedIcon /> },
        { label: "Mis sesiones", path: "/sessions", icon: <AccessTimeOutlinedIcon /> },
        { label: "Fichar", path: "/clock", icon: <PunchClockIcon /> },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <Drawer open={open} onClose={onClose}>
            <Toolbar />
            <List sx={{ width: 260 }}>
                {menuItems.map((item) => {
                    const isActive =
                        item.path === "/"
                            ? location.pathname === "/"
                            : location.pathname.startsWith(item.path);

                    return (
                        <ListItemButton
                            key={item.path}
                            onClick={() => handleNavigate(item.path)}
                            selected={isActive}
                            sx={{
                                borderRadius: 1,
                                mx: 1,
                                my: 0.5,
                                "&.Mui-selected": {
                                    backgroundColor: "primary.main",
                                    color: "white",
                                    "& .MuiListItemIcon-root": {
                                        color: "white",
                                    },
                                },
                                "&.Mui-selected:hover": {
                                    backgroundColor: "primary.dark",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    );
                })}

                <Divider sx={{ my: 1 }} />
            </List>
        </Drawer>
    );
}
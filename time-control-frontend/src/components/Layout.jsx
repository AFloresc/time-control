import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";


export default function Layout() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Navbar onMenuClick={() => setOpen(true)} />
            <Sidebar open={open} onClose={() => setOpen(false)} />

            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </>
    );
}
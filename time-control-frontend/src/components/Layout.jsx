import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <>
            <Navbar />
            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </>
    );
}
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import RequireAuth from "../components/RequireAuth";
import Layout from "../components/Layout";
import Sessions from "../pages/Sessions";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <RequireAuth>
                <Layout />
            </RequireAuth>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "sessions",
                element: <Sessions />,
            },


        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
]);

export default router;
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Home from "../pages/Home";
import RequireAuth from "../components/RequireAuth";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <RequireAuth>
                <App />
            </RequireAuth>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
]);

export default router;
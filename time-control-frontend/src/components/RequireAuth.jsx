import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    const { user, loading } = useAuth();

    if (loading) return null; // puedes poner un spinner MUI

    if (!user) return <Navigate to="/login" replace />;

    return children;
}
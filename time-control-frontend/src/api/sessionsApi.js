export async function fetchSessions(token) {
    const res = await fetch("http://localhost:8080/me/sessions", {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al cargar sesiones");
    return res.json();
}

export async function startSessionApi(token) {
    const res = await fetch("http://localhost:8080/me/sessions/start", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al iniciar sesión");
    return res.json().catch(() => null);
}

export async function endSessionApi(token) {
    const res = await fetch("http://localhost:8080/me/sessions/end", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al finalizar sesión");
    return res.json().catch(() => null);
}
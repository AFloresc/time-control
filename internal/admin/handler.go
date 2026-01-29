package admin

import (
	"encoding/json"
	"net/http"

	"time-control/internal/auth"
	"time-control/internal/sessions"
)

type Handler struct {
	sessionsService *sessions.Service
}

func NewHandler(sessionsService *sessions.Service) *Handler {
	return &Handler{
		sessionsService: sessionsService,
	}
}

// ------------------------------------------------------------
// GET /admin/ping
// Verifica acceso admin
// ------------------------------------------------------------
func (h *Handler) Ping(w http.ResponseWriter, r *http.Request) {
	role, _ := r.Context().Value(auth.ContextRole).(string)
	if role != "admin" {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	w.Write([]byte("admin ok"))
}

// ------------------------------------------------------------
// GET /admin/sessions
// Lista todas las sesiones o filtra por user_id
// ------------------------------------------------------------
func (h *Handler) GetSessions(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")

	var (
		result interface{}
		err    error
	)

	if userID != "" {
		// Filtrar por usuario
		result, err = h.sessionsService.GetUserSessions(userID)
	} else {
		// Todas las sesiones
		result, err = h.sessionsService.GetAllSessions()
	}

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}

// ------------------------------------------------------------
// GET /admin/sessions/all
// Alias explícito para obtener todas las sesiones
// ------------------------------------------------------------
func (h *Handler) GetAllSessions(w http.ResponseWriter, r *http.Request) {
	sessionsList, err := h.sessionsService.GetAllSessions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(sessionsList)
}

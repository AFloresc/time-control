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

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) Ping(w http.ResponseWriter, r *http.Request) {
	role, _ := r.Context().Value(auth.ContextRole).(string)
	if role != "admin" {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}

	w.Write([]byte("admin ok"))
}

func (h *Handler) GetAllSessions(w http.ResponseWriter, r *http.Request) {
	sessions, err := h.sessionsService.GetAllSessions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(sessions)
}

func (h *Handler) GetSessions(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("user_id")

	sessions, err := h.sessionsService.GetAdminSessions(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(sessions)
}

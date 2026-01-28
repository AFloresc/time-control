package intervals

import (
	"encoding/json"
	"net/http"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service}
}

// POST /me/sessions/pause
func (h *Handler) Pause(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Context().Value("sessionID").(uint)

	interval, err := h.service.CloseActiveInterval(sessionID)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	json.NewEncoder(w).Encode(interval)
}

// POST /me/sessions/resume
func (h *Handler) Resume(w http.ResponseWriter, r *http.Request) {
	sessionID := r.Context().Value("sessionID").(uint)

	interval, err := h.service.StartInterval(sessionID)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	json.NewEncoder(w).Encode(interval)
}

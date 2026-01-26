package sessions

import (
	"encoding/json"
	"net/http"
	"time"
)

type Handler struct {
	service *Service
}

type manualSessionRequest struct {
	Date  string `json:"date"`
	Start string `json:"start"`
	End   string `json:"end"`
}

func NewHandler(service *Service) *Handler {
	return &Handler{service}
}

func (h *Handler) StartSession(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)

	session, err := h.service.StartSession(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(session)
}

func (h *Handler) EndSession(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)

	session, err := h.service.EndSession(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(session)
}

func (h *Handler) CreateManualSession(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)

	var req manualSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		http.Error(w, "invalid date format", http.StatusBadRequest)
		return
	}

	start, err := time.Parse(time.RFC3339, req.Start)
	if err != nil {
		http.Error(w, "invalid start time", http.StatusBadRequest)
		return
	}

	end, err := time.Parse(time.RFC3339, req.End)
	if err != nil {
		http.Error(w, "invalid end time", http.StatusBadRequest)
		return
	}

	session, err := h.service.CreateManualSession(userID, date, start, end)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(session)
}

func (h *Handler) GetMySessions(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)

	sessions, err := h.service.GetUserSessions(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(sessions)
}

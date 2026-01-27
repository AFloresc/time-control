package sessions

import (
	"encoding/json"
	"net/http"
	"time"
	"time-control/internal/auth"
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

func getUserID(r *http.Request, w http.ResponseWriter) (string, bool) {
	uid, ok := r.Context().Value(auth.ContextUserID).(string)
	if !ok || uid == "" {
		http.Error(w, "missing userID in context", http.StatusUnauthorized)
		return "", false
	}
	return uid, true
}

func (h *Handler) StartSession(w http.ResponseWriter, r *http.Request) {
	userID, ok := getUserID(r, w)
	if !ok {
		return
	}

	session, err := h.service.StartSession(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(session)
}

func (h *Handler) EndSession(w http.ResponseWriter, r *http.Request) {
	userID, ok := getUserID(r, w)
	if !ok {
		return
	}

	session, err := h.service.EndSession(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(session)
}

func (h *Handler) CreateManualSession(w http.ResponseWriter, r *http.Request) {
	userID, ok := getUserID(r, w)
	if !ok {
		return
	}

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
	userID, ok := getUserID(r, w)
	if !ok {
		return
	}

	sessions, err := h.service.GetUserSessions(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(sessions)
}

func (h *Handler) GetAllSessions(w http.ResponseWriter, r *http.Request) {
	sessions, err := h.sessions.GetAllSessions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(sessions)
}

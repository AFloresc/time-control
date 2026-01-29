package sessions

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"time-control/internal/auth"

	"github.com/gorilla/mux"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service}
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

func getUserID(r *http.Request, w http.ResponseWriter) (string, bool) {
	uid, ok := r.Context().Value(auth.ContextUserID).(string)
	if !ok || uid == "" {
		http.Error(w, "missing userID in context", http.StatusUnauthorized)
		return "", false
	}
	return uid, true
}

type manualSessionRequest struct {
	Date  string `json:"date"`
	Start string `json:"start"`
	End   string `json:"end"`
}

// ------------------------------------------------------------
// POST /me/sessions/start
// Inicia jornada + crea primer intervalo
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// POST /me/sessions/end
// Cierra intervalo activo + cierra jornada
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// GET /me/sessions/active
// Devuelve jornada activa + intervalos
// ------------------------------------------------------------

func (h *Handler) GetActiveSession(w http.ResponseWriter, r *http.Request) {
	userID, ok := getUserID(r, w)
	if !ok {
		return
	}

	session, err := h.service.GetActiveSession(userID)
	if err != nil || session == nil {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("null"))
		return
	}

	json.NewEncoder(w).Encode(session)
}

// ------------------------------------------------------------
// POST /me/sessions/manual
// Crear sesión manual (sin intervalos)
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// GET /me/sessions
// Lista de sesiones del usuario (con intervalos)
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// GET /admin/sessions
// Lista completa de sesiones (admin)
// ------------------------------------------------------------

func (h *Handler) GetAllSessions(w http.ResponseWriter, r *http.Request) {
	sessions, err := h.service.GetAllSessions()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(sessions)
}

// ------------------------------------------------------------
// GET /admin/sessions/{id}
// Obtener sesión por ID (admin o dueño)
// ------------------------------------------------------------

func (h *Handler) GetSessionByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "invalid session ID", http.StatusBadRequest)
		return
	}

	session, err := h.service.GetSessionByID(uint(id))
	if err != nil {
		http.Error(w, "session not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(session)
}

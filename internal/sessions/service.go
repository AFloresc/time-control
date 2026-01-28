package sessions

import (
	"errors"
	"time"
	"time-control/internal/intervals"
)

var (
	ErrSessionAlreadyOpen = errors.New("ya existe una sesión abierta")
	ErrNoOpenSession      = errors.New("no hay sesión abierta")
	ErrInvalidTimeRange   = errors.New("el rango horario no es válido")
)

type Service struct {
	repo        Repository
	intervalSvc *intervals.Service
}

func NewService(repo Repository, intervalSvc *intervals.Service) *Service {
	return &Service{
		repo:        repo,
		intervalSvc: intervalSvc,
	}
}

// ------------------------------------------------------------
// INICIAR JORNADA (crea sesión + primer intervalo)
// ------------------------------------------------------------
func (s *Service) StartSession(userID string) (*WorkSession, error) {
	// ¿Ya hay una jornada abierta?
	open, err := s.repo.GetActiveSession(userID)
	if err == nil && open != nil {
		return nil, ErrSessionAlreadyOpen
	}

	now := time.Now()

	session := &WorkSession{
		UserID:    userID,
		Date:      now.Truncate(24 * time.Hour),
		StartTime: now,
		Source:    "auto",
		CreatedAt: now,
	}

	if err := s.repo.Create(session); err != nil {
		return nil, err
	}

	// Crear primer intervalo
	if _, err := s.intervalSvc.StartInterval(session.ID); err != nil {
		return nil, err
	}

	return session, nil
}

// ------------------------------------------------------------
// CREAR SESIÓN MANUAL (no afecta a intervalos)
// ------------------------------------------------------------
func (s *Service) CreateManualSession(userID string, date time.Time, start, end time.Time) (*WorkSession, error) {
	if !end.After(start) {
		return nil, ErrInvalidTimeRange
	}

	session := &WorkSession{
		UserID:    userID,
		Date:      date.Truncate(24 * time.Hour),
		StartTime: start,
		EndTime:   &end,
		Source:    "manual",
		CreatedAt: time.Now(),
		ClosedAt:  &end,
	}

	if err := s.repo.Create(session); err != nil {
		return nil, err
	}

	return session, nil
}

// ------------------------------------------------------------
// FINALIZAR JORNADA (cierra intervalo activo + cierra sesión)
// ------------------------------------------------------------
func (s *Service) EndSession(userID string) (*WorkSession, error) {
	session, err := s.repo.GetActiveSession(userID)
	if err != nil || session == nil {
		return nil, ErrNoOpenSession
	}

	now := time.Now()

	// Cerrar intervalo activo
	_, _ = s.intervalSvc.CloseActiveInterval(session.ID)

	// Cerrar jornada
	if err := s.repo.CloseSession(session.ID, now); err != nil {
		return nil, err
	}

	session.EndTime = &now
	session.ClosedAt = &now

	return session, nil
}

// ------------------------------------------------------------
// CONSULTAS
// ------------------------------------------------------------
func (s *Service) GetUserSessions(userID string) ([]WorkSession, error) {
	return s.repo.GetByUser(userID)
}

func (s *Service) GetSessionsForAdmin(userID string) ([]WorkSession, error) {
	return s.repo.GetByUser(userID)
}

func (s *Service) GetAllSessions() ([]WorkSession, error) {
	return s.repo.GetAllSessions()
}

func (s *Service) GetAdminSessions(userID string) ([]WorkSession, error) {
	if userID != "" {
		return s.repo.GetSessionsByUser(userID)
	}
	return s.repo.GetAllSessions()
}

package sessions

import (
	"errors"
	"time"
)

var (
	ErrSessionAlreadyOpen = errors.New("ya existe una sesión abierta")
	ErrNoOpenSession      = errors.New("no hay sesión abierta")
	ErrInvalidTimeRange   = errors.New("el rango horario no es válido")
)

type Service struct {
	repo Repository
}

func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) StartSession(userID string) (*WorkSession, error) {
	// ¿Ya hay una sesión abierta?
	open, err := s.repo.GetOpenSession(userID)
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

	return session, nil
}

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

func (s *Service) GetUserSessions(userID string) ([]WorkSession, error) {
	return s.repo.GetByUser(userID)
}

func (s *Service) GetSessionsForAdmin(userID string) ([]WorkSession, error) {
	return s.repo.GetByUser(userID)
}

func (s *Service) EndSession(userID string) (*WorkSession, error) {
	// Buscar sesión abierta
	session, err := s.repo.GetOpenSession(userID)
	if err != nil {
		return nil, ErrNoOpenSession
	}

	now := time.Now()

	// Cerrar sesión en DB
	if err := s.repo.CloseSession(session.ID, now); err != nil {
		return nil, err
	}

	// Actualizar struct en memoria para devolverlo completo
	session.EndTime = &now
	session.ClosedAt = &now

	return session, nil
}

func (s *Service) GetAllSessions() ([]WorkSession, error) {
	return s.repo.GetAllSessions()
}

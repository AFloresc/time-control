package intervals

import (
	"errors"
	"time"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo}
}

// ------------------------------------------------------------
// Crear un nuevo intervalo (reanudar)
// ------------------------------------------------------------
func (s *Service) StartInterval(sessionID uint) (*WorkInterval, error) {
	// Cerrar intervalo previo si existe
	active, _ := s.repo.GetActiveInterval(sessionID)
	if active != nil {
		_, _ = s.CloseActiveInterval(sessionID)
	}

	interval := &WorkInterval{
		SessionID: sessionID,
		StartTime: time.Now(),
	}

	return interval, s.repo.Create(interval)
}

// ------------------------------------------------------------
// Cerrar intervalo activo (pausar o finalizar jornada)
// ------------------------------------------------------------
func (s *Service) CloseActiveInterval(sessionID uint) (*WorkInterval, error) {
	interval, err := s.repo.GetActiveInterval(sessionID)
	if err != nil || interval == nil {
		return nil, errors.New("no active interval")
	}

	now := time.Now()
	interval.EndTime = &now

	return interval, s.repo.CloseInterval(interval)
}

// ------------------------------------------------------------
// Obtener intervalo activo
// ------------------------------------------------------------
func (s *Service) GetActiveInterval(sessionID uint) (*WorkInterval, error) {
	return s.repo.GetActiveInterval(sessionID)
}

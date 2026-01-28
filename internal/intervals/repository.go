package intervals

import (
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db}
}

func (r *Repository) Create(interval *WorkInterval) error {
	return r.db.Create(interval).Error
}

func (r *Repository) GetActiveInterval(sessionID uint) (*WorkInterval, error) {
	var interval WorkInterval
	err := r.db.Where("session_id = ? AND end_time IS NULL", sessionID).
		First(&interval).Error
	if err != nil {
		return nil, err
	}
	return &interval, nil
}

func (r *Repository) CloseInterval(interval *WorkInterval) error {
	return r.db.Save(interval).Error
}

func (r *Repository) GetBySession(sessionID uint) ([]WorkInterval, error) {
	var intervals []WorkInterval
	err := r.db.Where("session_id = ?", sessionID).Find(&intervals).Error
	return intervals, err
}

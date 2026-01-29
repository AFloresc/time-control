package sessions

import (
	"time"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db}
}

func (r *Repository) Create(session *WorkSession) error {
	return r.db.Create(session).Error
}

func (r *Repository) CloseSession(id uint, end time.Time) error {
	return r.db.Model(&WorkSession{}).
		Where("id = ? AND end_time IS NULL", id).
		Updates(map[string]interface{}{
			"end_time":  end,
			"closed_at": time.Now(),
		}).Error
}

func (r *Repository) GetActiveSession(userID string) (*WorkSession, error) {
	var session WorkSession
	err := r.db.
		Where("user_id = ? AND end_time IS NULL", userID).
		Preload("Intervals").
		First(&session).Error

	if err != nil {
		return nil, err
	}

	return &session, nil
}

func (r *Repository) GetByUser(userID string) ([]WorkSession, error) {
	var sessions []WorkSession
	err := r.db.
		Where("user_id = ?", userID).
		Order("date desc").
		Preload("Intervals").
		Find(&sessions).Error

	return sessions, err
}

func (r *Repository) GetAllSessions() ([]WorkSession, error) {
	var sessions []WorkSession
	if err := r.db.Order("start_time DESC").Find(&sessions).Error; err != nil {
		return nil, err
	}
	return sessions, nil
}

func (r *Repository) GetSessionsByUser(userID string) ([]WorkSession, error) {
	var sessions []WorkSession
	err := r.db.
		Where("user_id = ?", userID).
		Order("start_time DESC").
		Preload("Intervals").
		Find(&sessions).Error

	return sessions, err
}

func (r *Repository) GetOpenSession(userID string) (*WorkSession, error) {
	return r.GetActiveSession(userID)
}

func (r *Repository) GetByID(id uint) (*WorkSession, error) {
	var session WorkSession
	if err := r.db.
		Where("id = ?", id).
		Preload("Intervals").
		First(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

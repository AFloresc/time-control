package intervals

import "time"

type WorkInterval struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	SessionID uint      `gorm:"index;not null"`
	StartTime time.Time `gorm:"not null"`
	EndTime   *time.Time
}

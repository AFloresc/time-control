package sessions

import (
	"time"
	"time-control/internal/intervals"
)

type WorkSession struct {
	ID        uint      `gorm:"primaryKey;autoIncrement"`
	UserID    string    `gorm:"index;not null"`
	Date      time.Time `gorm:"index;not null"`
	StartTime time.Time `gorm:"not null"`
	EndTime   *time.Time
	Source    string `gorm:"not null"` // "manual" | "auto"
	CreatedAt time.Time
	ClosedAt  *time.Time
	Intervals []intervals.WorkInterval `gorm:"foreignKey:SessionID"`
}

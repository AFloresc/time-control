package users

import "time"

type User struct {
	ID        string `gorm:"primaryKey"` // Firebase UID
	Email     string `gorm:"uniqueIndex;not null"`
	Name      string `gorm:"not null"`
	Role      string `gorm:"not null"` // "user" | "admin"
	CreatedAt time.Time
}

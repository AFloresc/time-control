package database

import (
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("data/timecontrol.db"), &gorm.Config{})

	if err != nil {
		return nil, err
	}
	return db, nil
}

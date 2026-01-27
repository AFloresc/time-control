package database

import (
	"fmt"
	"path/filepath"
	"runtime"

	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	// Obtener ruta absoluta del archivo actual (database.go)
	_, file, _, _ := runtime.Caller(0)

	// Ir al directorio raíz del proyecto
	base := filepath.Join(filepath.Dir(file), "..", "..")

	// Construir la ruta a la base de datos
	dbPath := filepath.Join(base, "data", "timecontrol.db")

	fmt.Println("DB path:", dbPath)

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

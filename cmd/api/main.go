package main

import (
	"log"
	"net/http"

	"time-control/internal/database"
	"time-control/internal/router"
	"time-control/internal/sessions"
)

func main() {
	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}

	// Migraciones
	db.AutoMigrate(&sessions.WorkSession{})

	// Repos + servicios + handlers
	sessionRepo := sessions.NewRepository(db)
	sessionService := sessions.NewService(*sessionRepo)
	sessionHandler := sessions.NewHandler(sessionService)

	r := router.NewRouter(sessionHandler)

	log.Println("Servidor iniciado en :8080")
	http.ListenAndServe(":8080", r)
}

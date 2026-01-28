package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"time-control/internal/auth"
	"time-control/internal/database"
	"time-control/internal/intervals"
	"time-control/internal/router"
	"time-control/internal/sessions"
	"time-control/internal/users"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {

	godotenv.Load("../../.env")
	fmt.Println("len creds:", len(os.Getenv("FIREBASE_CREDENTIALS")))
	fmt.Println("ENV loaded:", os.Getenv("FIREBASE_CREDENTIALS") != "")

	db, err := database.Connect()
	if err != nil {
		log.Fatal(err)
	}

	// Migraciones
	db.AutoMigrate(
		&users.User{},
		&sessions.WorkSession{},
		&intervals.WorkInterval{},
	)

	auth.InitFirebase()

	// Repos + servicios + handlers
	firebaseApp := auth.FirebaseApp
	userRepo := users.NewRepository(db)
	sessionRepo := sessions.NewRepository(db)
	sessionService := sessions.NewService(*sessionRepo)
	sessionHandler := sessions.NewHandler(sessionService)

	r := router.NewRouter(sessionHandler, userRepo, firebaseApp)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}).Handler(r)

	log.Println("Servidor iniciado en :8080")
	http.ListenAndServe(":8080", corsHandler)
}

package router

import (
	"net/http"

	"time-control/internal/auth"
	"time-control/internal/sessions"
	"time-control/internal/users"

	firebase "firebase.google.com/go/v4"
	"github.com/gorilla/mux"
)

func NewRouter(sessionHandler *sessions.Handler, userRepo *users.Repository, firebaseApp *firebase.App) http.Handler {
	r := mux.NewRouter()

	// Middleware de Firebase (lo añadiremos luego)
	me := r.PathPrefix("/me").Subrouter()
	me.Use(auth.FirebaseAuthMiddleware(userRepo, firebaseApp))

	// Rutas de sesiones del usuario
	sessionsRouter := me.PathPrefix("/sessions").Subrouter()
	sessionsRouter.HandleFunc("/start", sessionHandler.StartSession).Methods("POST")
	sessionsRouter.HandleFunc("/end", sessionHandler.EndSession).Methods("POST")
	sessionsRouter.HandleFunc("/manual", sessionHandler.CreateManualSession).Methods("POST")
	sessionsRouter.HandleFunc("", sessionHandler.GetMySessions).Methods("GET")

	return r
}

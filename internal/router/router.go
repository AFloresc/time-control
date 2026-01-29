package router

import (
	"net/http"

	"time-control/internal/admin"
	"time-control/internal/auth"
	"time-control/internal/sessions"
	"time-control/internal/users"

	firebase "firebase.google.com/go/v4"
	"github.com/gorilla/mux"
)

func NewRouter(
	sessionHandler *sessions.Handler,
	sessionService *sessions.Service,
	userRepo *users.Repository,
	firebaseApp *firebase.App,
) http.Handler {

	r := mux.NewRouter()

	// ------------------------------------------------------------
	// /me (usuario autenticado)
	// ------------------------------------------------------------
	me := r.PathPrefix("/me").Subrouter()
	me.Use(auth.FirebaseAuthMiddleware(userRepo, firebaseApp))

	// Sesiones del usuario
	sessionsRouter := me.PathPrefix("/sessions").Subrouter()
	sessionsRouter.HandleFunc("/start", sessionHandler.StartSession).Methods("POST")
	sessionsRouter.HandleFunc("/end", sessionHandler.EndSession).Methods("POST")
	sessionsRouter.HandleFunc("/manual", sessionHandler.CreateManualSession).Methods("POST")
	sessionsRouter.HandleFunc("/pause", sessionHandler.PauseSession).Methods("POST")
	sessionsRouter.HandleFunc("/resume", sessionHandler.ResumeSession).Methods("POST")
	sessionsRouter.HandleFunc("", sessionHandler.GetMySessions).Methods("GET")

	// ------------------------------------------------------------
	// /admin (solo administradores)
	// ------------------------------------------------------------
	adminHandler := admin.NewHandler(sessionService)

	adminRouter := r.PathPrefix("/admin").Subrouter()
	adminRouter.Use(auth.FirebaseAuthMiddleware(userRepo, firebaseApp))
	adminRouter.Use(auth.RequireAdmin)

	adminRouter.HandleFunc("/ping", adminHandler.Ping).Methods("GET")
	adminRouter.HandleFunc("/sessions", adminHandler.GetSessions).Methods("GET")
	adminRouter.HandleFunc("/sessions/all", adminHandler.GetAllSessions).Methods("GET")

	return r
}

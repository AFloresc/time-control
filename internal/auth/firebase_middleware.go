package auth

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"time-control/internal/users"

	firebase "firebase.google.com/go/v4"
)

type contextKey string

const (
	ContextUserID contextKey = "userID"
	ContextEmail  contextKey = "email"
	ContextRole   contextKey = "role"
)

func FirebaseAuthMiddleware(userRepo *users.Repository, app *firebase.App) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "missing Authorization header", http.StatusUnauthorized)
				return
			}

			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				http.Error(w, "invalid Authorization header", http.StatusUnauthorized)
				return
			}

			idToken := parts[1]

			client, err := app.Auth(r.Context())
			if err != nil {
				http.Error(w, "firebase auth error", http.StatusInternalServerError)
				return
			}

			token, err := client.VerifyIDToken(r.Context(), idToken)
			if err != nil {
				http.Error(w, "invalid token", http.StatusUnauthorized)
				return
			}

			uid := token.UID
			email, _ := token.Claims["email"].(string)

			user, err := userRepo.GetByID(uid)
			if err != nil {
				user = &users.User{
					ID:    uid,
					Email: email,
					Name:  email,
					Role:  "user",
				}
				fmt.Println("UID:", uid)
				fmt.Println("Email:", email)
				fmt.Println("User before create:", user)

				if err := userRepo.Create(user); err != nil {
					http.Error(w, "failed to create user", http.StatusInternalServerError)
					return
				}
			}

			ctx := context.WithValue(r.Context(), ContextUserID, user.ID)
			ctx = context.WithValue(ctx, ContextEmail, user.Email)
			ctx = context.WithValue(ctx, ContextRole, user.Role)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

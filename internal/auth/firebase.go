package auth

import (
	"context"
	"log"
	"os"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var FirebaseApp *firebase.App

func InitFirebase() {
	ctx := context.Background()

	creds := os.Getenv("FIREBASE_CREDENTIALS")
	if creds == "" {
		log.Fatal("FIREBASE_CREDENTIALS env var is missing")
	}

	opt := option.WithAuthCredentialsJSON(option.ServiceAccount, []byte(creds))

	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		log.Fatalf("error initializing firebase: %v", err)
	}

	FirebaseApp = app
}

# time-control

Gestión del control horario laboral.

---

## 📁 Estructura del proyecto

```text
time-control/
│
├── cmd/
│   └── api/
│       └── main.go
│
├── internal/
│   ├── config/
│   │   └── config.go
│   │
│   ├── database/
│   │   └── sqlite.go
│   │
│   ├── auth/
│   │   └── firebase_middleware.go
│   │
│   ├── users/
│   │   ├── model.go
│   │   ├── repository.go
│   │   ├── service.go
│   │   └── handler.go
│   │
│   ├── sessions/
│   │   ├── model.go
│   │   ├── repository.go
│   │   ├── service.go
│   │   └── handler.go
│   │
│   ├── router/
│   │   └── router.go
│   │
│   └── utils/
│       └── time.go
│
├── data/               ← SQLite DB aquí (no en git)
│   └── .gitignore
│
├── go.mod
└── go.sum
```

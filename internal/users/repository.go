package users

import "gorm.io/gorm"

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db}
}

func (r *Repository) GetByID(id string) (*User, error) {
	var user User
	if err := r.db.First(&user, "id = ?", id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) GetByEmail(email string) (*User, error) {
	var user User
	if err := r.db.First(&user, "email = ?", email).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) Create(user *User) error {
	return r.db.Create(user).Error
}

func (r *Repository) ListAll() ([]User, error) {
	var users []User
	if err := r.db.Order("created_at desc").Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

package models

import "gorm.io/gorm"

type Task struct {
	gorm.Model
	Title       string   `gorm:"not null"`
	Description string   `gorm:"not null"`
	Status      string   `gorm:"not null;default:'pending'"` // 'pending', 'in_progress', 'completed'
	AssignedToID *uint    // Pointer to allow null foreign key
	AssignedTo   User     `gorm:"foreignKey:AssignedToID"`
	IncidentID  uint     `gorm:"not null"`
	Incident    Incident `gorm:"foreignKey:IncidentID"`
}

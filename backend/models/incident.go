package models

import "gorm.io/gorm"

// Location is a simple struct to hold coordinates.
// For a real PostGIS app, you'd use a more specific geometry type.
type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Incident struct {
	gorm.Model
	Description string   `gorm:"not null"`
	Latitude    float64  `gorm:"not null"`
	Longitude   float64  `gorm:"not null"`
	ImageURL    string   // URL to the uploaded image
	ReporterID  uint     `gorm:"not null"`
	Reporter    User     `gorm:"foreignKey:ReporterID"`
	Status      string   `gorm:"not null;default:'reported'"` // e.g., 'reported', 'in_progress', 'resolved'
}

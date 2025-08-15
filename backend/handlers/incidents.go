package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"ramani/backend/database"
	"ramani/backend/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateIncidentInput defines the structure for incident creation data from a form.
type CreateIncidentInput struct {
	Description string  `form:"description" binding:"required"`
	Latitude    float64 `form:"latitude" binding:"required"`
	Longitude   float64 `form:"longitude" binding:"required"`
}

// CreateIncident handles creating a new incident, including an image upload.
func CreateIncident(c *gin.Context) {
	var input CreateIncidentInput
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}

	// Generate a unique filename
	uploadDir := os.Getenv("UPLOAD_DIR")
	filename := uuid.New().String() + filepath.Ext(file.Filename)
	filePath := filepath.Join(uploadDir, filename)

	// Create upload directory if it doesn't exist
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create upload directory"})
		return
	}

	// Save the file
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	incident := models.Incident{
		Description: input.Description,
		Latitude:    input.Latitude,
		Longitude:   input.Longitude,
		ImageURL:    fmt.Sprintf("/uploads/%s", filename), // URL path to access the file
		ReporterID:  uint(userID.(float64)),
		Status:      "reported",
	}

	if err := database.DB.Create(&incident).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create incident"})
		return
	}

	c.JSON(http.StatusOK, incident)
}

// GetIncidents retrieves all incidents.
func GetIncidents(c *gin.Context) {
	var incidents []models.Incident
	if err := database.DB.Preload("Reporter").Order("created_at desc").Find(&incidents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get incidents"})
		return
	}
	c.JSON(http.StatusOK, incidents)
}

// GetIncident retrieves a single incident by ID.
func GetIncident(c *gin.Context) {
	id := c.Param("id")
	var incident models.Incident
	if err := database.DB.Preload("Reporter").First(&incident, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Incident not found"})
		return
	}
	c.JSON(http.StatusOK, incident)
}

// UpdateIncident updates an existing incident.
func UpdateIncident(c *gin.Context) {
	id := c.Param("id")
	var incident models.Incident
	if err := database.DB.First(&incident, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Incident not found"})
		return
	}

	var input models.Incident
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	incident.Description = input.Description
	incident.Status = input.Status
	// Location and image are not typically updated this way, but can be added if needed.

	if err := database.DB.Save(&incident).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update incident"})
		return
	}

	c.JSON(http.StatusOK, incident)
}

// DeleteIncident deletes an incident.
func DeleteIncident(c *gin.Context) {
	id := c.Param("id")
	var incident models.Incident
	if err := database.DB.First(&incident, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Incident not found"})
		return
	}

	// Optionally, delete the associated image file from storage
	// imagePath := filepath.Join(".", incident.ImageURL)
	// os.Remove(imagePath)

	if err := database.DB.Delete(&incident).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete incident"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Incident deleted successfully"})
}

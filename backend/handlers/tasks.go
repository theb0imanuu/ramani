package handlers

import (
	"net/http"
	"ramani/backend/database"
	"ramani/backend/models"

	"github.com/gin-gonic/gin"
)

// CreateTaskInput defines the structure for creating a new task.
type CreateTaskInput struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	IncidentID  uint   `json:"incidentId" binding:"required"`
	AssignedToID *uint  `json:"assignedToId"`
}

// CreateTask creates a new task.
func CreateTask(c *gin.Context) {
	var input CreateTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task := models.Task{
		Title:       input.Title,
		Description: input.Description,
		IncidentID:  input.IncidentID,
		AssignedToID: input.AssignedToID,
		Status:      "pending",
	}

	if err := database.DB.Create(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

// GetTasks retrieves all tasks.
func GetTasks(c *gin.Context) {
	var tasks []models.Task
	// Preload related data for a richer response
	if err := database.DB.Preload("AssignedTo").Preload("Incident").Order("created_at desc").Find(&tasks).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not get tasks"})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

// GetTask retrieves a single task by ID.
func GetTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := database.DB.Preload("AssignedTo").Preload("Incident").First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}
	c.JSON(http.StatusOK, task)
}

// UpdateTaskInput defines the structure for updating a task.
type UpdateTaskInput struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	AssignedToID *uint  `json:"assignedToId"`
}

// UpdateTask updates an existing task.
func UpdateTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := database.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	var input UpdateTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields from input
	task.Title = input.Title
	task.Description = input.Description
	task.Status = input.Status
	task.AssignedToID = input.AssignedToID

	if err := database.DB.Save(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not update task"})
		return
	}

	// Refetch the task with preloaded data to return the full object
	var updatedTask models.Task
	database.DB.Preload("AssignedTo").Preload("Incident").First(&updatedTask, id)

	c.JSON(http.StatusOK, updatedTask)
}

// DeleteTask deletes a task.
func DeleteTask(c *gin.Context) {
	id := c.Param("id")
	var task models.Task
	if err := database.DB.First(&task, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	if err := database.DB.Delete(&task).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not delete task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

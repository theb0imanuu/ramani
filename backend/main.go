package main

import (
	"log"
	"os"
	"ramani/backend/database"
	"ramani/backend/handlers"
	"ramani/backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file from the current directory
	err := godotenv.Load()
	if err != nil {
		log.Println("Could not load .env file, using environment variables from Docker instead")
	}

	// Connect to database
	database.Connect()

	// Set up Gin router
	router := gin.Default()

	// CORS Middleware
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"} // In production, restrict this to your frontend's domain
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	router.Use(cors.New(config))

	// Serve static files (uploaded images)
	uploadDir := os.Getenv("UPLOAD_DIR")
	if uploadDir == "" {
		uploadDir = "./uploads" // Default value
	}
	router.Static("/uploads", uploadDir)

	// Public routes
	api := router.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", handlers.Register)
			auth.POST("/login", handlers.Login)
		}
	}

	// Protected routes
	protected := api.Group("/")
	protected.Use(middleware.AuthMiddleware())
	{
		// Incident routes
		incidents := protected.Group("/incidents")
		{
			incidents.POST("/", handlers.CreateIncident)
			incidents.GET("/", handlers.GetIncidents)
			incidents.GET("/:id", handlers.GetIncident)
			incidents.PUT("/:id", middleware.AdminMiddleware(), handlers.UpdateIncident)    // Admin only
			incidents.DELETE("/:id", middleware.AdminMiddleware(), handlers.DeleteIncident) // Admin only
		}

		// Task routes
		tasks := protected.Group("/tasks")
		{
			tasks.POST("/", middleware.AdminMiddleware(), handlers.CreateTask) // Admin only
			tasks.GET("/", handlers.GetTasks)
			tasks.GET("/:id", handlers.GetTask)
			tasks.PUT("/:id", middleware.AdminMiddleware(), handlers.UpdateTask)    // Admin only
			tasks.DELETE("/:id", middleware.AdminMiddleware(), handlers.DeleteTask) // Admin only
		}

		// User management routes (Admin only)
		users := protected.Group("/users")
		users.Use(middleware.AdminMiddleware())
		{
			users.POST("/", handlers.CreateUser)
			users.GET("/", handlers.GetUsers)
			users.GET("/:id", handlers.GetUser)
			users.PUT("/:id", handlers.UpdateUser)
			users.DELETE("/:id", handlers.DeleteUser)
		}
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to run server:", err)
	}
}

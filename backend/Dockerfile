# Stage 1: Build the Go application
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum and download dependencies
COPY go.mod ./
# We don't have a go.sum, so we'll let `go mod download` create it.
# If you have a go.sum, uncomment the next line
# COPY go.sum ./
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the application
# CGO_ENABLED=0 is important for building a static binary that can run in a scratch image
# -o /app/main creates the binary at this path
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app/main .

# Stage 2: Create the final, lightweight image
FROM alpine:latest

WORKDIR /root/

# Copy the pre-built binary from the builder stage
COPY --from=builder /app/main .

# The UPLOAD_DIR will be created by the application if it doesn't exist,
# but it's good practice to create it. We'll assume the app handles it.
# The .env file will be sourced by docker-compose, not copied into the image.

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["./main"]

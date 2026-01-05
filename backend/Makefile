.PHONY: help install dev start test test-watch lint docker-build docker-up docker-down docker-logs clean

APP_NAME = auth-backend-service

help:
	@echo "Available commands:"
	@echo "  make install       - Install dependencies"
	@echo "  make dev           - Run in development mode"
	@echo "  make start         - Run in production mode"
	@echo "  make test          - Run tests"
	@echo "  make test-watch    - Run tests in watch mode"
	@echo "  make lint          - Run ESLint"
	@echo "  make docker-build  - Build Docker image"
	@echo "  make docker-up     - Start Docker containers"
	@echo "  make docker-down   - Stop Docker containers"
	@echo "  make docker-logs   - View Docker logs"
	@echo "  make clean         - Clean build artifacts"

install:
	@echo "Installing dependencies..."
	@npm install

dev:
	@echo "Running in development mode..."
	@npm run dev

start:
	@echo "Starting application..."
	@npm start

test:
	@echo "Running tests..."
	@npm test

test-watch:
	@echo "Running tests in watch mode..."
	@npm run test:watch

lint:
	@echo "Running linter..."
	@npm run lint

docker-build:
	@echo "Building Docker image..."
	@docker build -t $(APP_NAME) .

docker-up:
	@echo "Starting Docker containers..."
	@docker-compose up -d

docker-down:
	@echo "Stopping Docker containers..."
	@docker-compose down

docker-logs:
	@echo "Viewing Docker logs..."
	@docker-compose logs -f

clean:
	@echo "Cleaning build artifacts..."
	@rm -rf node_modules
	@rm -rf coverage
	@npm cache clean --force

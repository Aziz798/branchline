db-generate:
	@echo "Generating database..."
	@pnpm run db:generate

db-migrate:
	@echo "Migrating database..."
	@pnpm run db:migrate

db-studio:
	@echo "Opening database studio..."
	@pnpm run db:studio
# Create DB container
docker-run:
	@if docker compose up -d 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose up -d; \
	fi

# Shutdown DB container
docker-down:
	@if docker compose down 2>/dev/null; then \
		: ; \
	else \
		echo "Falling back to Docker Compose V1"; \
		docker-compose down; \
	fi

build-auth-service:
	@echo "Building auth service..."
	@go build -o bin/auth-service ./src/services/auth-service/cmd/api/main.go

run-auth-service: build-auth-service
	@echo "Running auth service..."
	@./bin/auth-service

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -Force -Recurse .\bin

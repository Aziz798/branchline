# Branchline Server

A microservices-based backend server built with Go (Fiber framework) for the
main API services and Node.js/TypeScript for database management. The server
provides authentication services with OAuth support and uses PostgreSQL as the
primary database with Drizzle ORM for migrations.

## 🏗️ Architecture

This server follows a microservices architecture with the following components:

- **Auth Service** - Go-based authentication service with JWT and OAuth support
- **Database Migration Service** - TypeScript-based service for database schema
  management
- **Shared Libraries** - Common Go libraries for database, email, middleware,
  models, utilities, and validations

## 🛠️ Tech Stack

### Backend Services

- **Go 1.24.4** - Main API services
- **Fiber v2** - High-performance Go web framework
- **Node.js/TypeScript** - Database migration service

### Database & ORM

- **PostgreSQL 17.5** - Primary database
- **Drizzle ORM** - TypeScript ORM for database migrations
- **pgx/v5** - PostgreSQL driver for Go

### Authentication & Security

- **JWT (golang-jwt/jwt/v5)** - JSON Web Tokens
- **OAuth2** - OAuth authentication support
- **bcrypt** - Password hashing
- **Validator** - Input validation

### Email & Communication

- **Mailgun** - Email service integration

### DevOps & Containerization

- **Docker & Docker Compose** - Containerization
- **Air** - Go live reload for development

## 📁 Project Structure

```
server/
├── bin/                           # Compiled binaries
├── migrations/                    # Database migration files
│   ├── 0000_new_jimmy_woo.sql
│   └── meta/
├── src/
│   ├── libs/                      # Shared libraries
│   │   └── go/
│   │       ├── database/          # Database connection utilities
│   │       ├── email/             # Email service utilities
│   │       ├── middleware/        # HTTP middleware
│   │       ├── models/            # Data models
│   │       ├── utils/             # General utilities & token handling
│   │       └── validations/       # Input validation utilities
│   └── services/
│       ├── auth-service/          # Authentication microservice
│       │   ├── cmd/api/           # Main application entry
│       │   ├── internal/          # Internal service logic
│       │   └── oauth/             # OAuth configuration and routes
│       └── db-migrations-service/ # Database schema management
├── docker-compose.yml             # Docker services configuration
├── drizzle.config.ts             # Drizzle ORM configuration
├── go.mod                        # Go module dependencies
├── Makefile                      # Build and development commands
└── package.json                  # Node.js dependencies for migrations
```

## 🚀 Getting Started

### Prerequisites

- **Go 1.24.4+**
- **Node.js 18+** with **pnpm**
- **Docker & Docker Compose**
- **PostgreSQL 17.5** (or use Docker)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=branchline

# Auth Service Configuration
AUTH_SERVICE_URL=:8080

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email Configuration (Mailgun)
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   # Install Go dependencies
   go mod download

   # Install Node.js dependencies for migrations
   pnpm install
   ```

3. **Start the database**
   ```bash
   make docker-run
   ```

4. **Run database migrations**
   ```bash
   make db-generate
   make db-migrate
   ```

5. **Build and run the auth service**
   ```bash
   make run-auth-service
   ```

## 📋 Available Commands

### Database Commands

```bash
make db-generate    # Generate database migrations
make db-migrate     # Apply database migrations
make db-studio      # Open Drizzle Studio (database GUI)
```

### Docker Commands

```bash
make docker-run     # Start PostgreSQL container
make docker-down    # Stop PostgreSQL container
```

### Service Commands

```bash
make build-auth-service   # Build auth service binary
make run-auth-service     # Build and run auth service
make watch-auth-service   # Run auth service with live reload
```

### Utility Commands

```bash
make clean          # Clean compiled binaries
```

## 🔐 Authentication Features

The auth service supports:

- **Email/Password Authentication** - Traditional login with hashed passwords
- **OAuth Integration** - Google and GitHub OAuth support
- **JWT Tokens** - Secure token-based authentication
- **User Roles** - Admin and user role management
- **Email Verification** - Mailgun integration for email verification

## 🗄️ Database Schema

The database includes tables for:

- **Users** - User accounts with multiple login providers
- **Projects** - Project management with status tracking
- **User-Project Relations** - Role-based project memberships (Scrum Master,
  etc.)

## 🔧 Development

### Live Reload Development

For development with automatic reloading:

```bash
make watch-auth-service
```

### Database Management

Access the database studio for visual database management:

```bash
make db-studio
```

This opens Drizzle Studio in your browser for easy database inspection and
modification.

### Adding New Migrations

1. Update the schema in `src/services/db-migrations-service/schema.ts`
2. Generate new migration: `make db-generate`
3. Apply migration: `make db-migrate`

## 🚀 Deployment

### Production Build

```bash
make build-auth-service
```

The compiled binary will be available in the `bin/` directory.

### Docker Deployment

The project includes Docker Compose configuration for the PostgreSQL database.
For full application deployment, you may need to create additional Docker
configurations for the Go services.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

The auth service provides the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/oauth/google` - Google OAuth authentication
- `POST /auth/oauth/github` - GitHub OAuth authentication
- `GET /auth/verify` - JWT token verification
- `POST /auth/refresh` - Token refresh

_For detailed API documentation, consider adding OpenAPI/Swagger documentation._

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running: `make docker-run`
   - Check environment variables in `.env`
   - Verify database credentials

2. **Migration Errors**
   - Ensure database is accessible
   - Check migration files in `migrations/` directory
   - Try: `make db-generate` then `make db-migrate`

3. **Auth Service Won't Start**
   - Check if port is already in use
   - Verify `AUTH_SERVICE_URL` environment variable
   - Ensure all required environment variables are set

## 📄 License

This project is licensed under the ISC License.

## 👥 Team

Built with ❤️ by the Branchline team.

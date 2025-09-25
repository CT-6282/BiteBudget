# BiteBudget V2 - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

<!-- Clean deployment trigger - September 25, 2025 -->

## Project Overview

BiteBudget V2 is a modern grocery shopping analysis and budget management application with the following stack:

### Backend (Flask/Python)

- **Framework**: Flask with SQLAlchemy ORM
- **Database**: SQLite for development, easily configurable for PostgreSQL/MySQL in production
- **Authentication**: JWT-based authentication with Flask-JWT-Extended
- **API Design**: RESTful API with consistent error handling and response formats
- **Features**: Receipt scanning, budget tracking, analytics, product management

### Frontend (React/TypeScript)

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5 with custom theme
- **State Management**: React Context API for authentication, local state for components
- **Routing**: React Router v6
- **Charts**: Recharts library for data visualization
- **HTTP Client**: Axios for API calls

## Code Style Guidelines

### Backend

- Use Flask blueprints for route organization
- Follow PEP 8 for Python code style
- Use type hints where appropriate
- Implement proper error handling with try-catch blocks
- Use SQLAlchemy models with proper relationships
- Include docstrings for complex functions

### Frontend

- Use TypeScript interfaces for type safety
- Follow React functional components with hooks
- Use Material-UI components and styling system (sx prop)
- Implement proper error boundaries and loading states
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Create reusable components in the components directory

## API Patterns

- All API responses should follow this format:
  ```json
  {
    "data": {...},
    "message": "Success message",
    "error": null
  }
  ```
- Use proper HTTP status codes
- Implement JWT authentication for protected routes
- Include CORS configuration for frontend communication

## Database Schema

- User authentication with hashed passwords
- Receipt and ReceiptItem models with proper foreign keys
- Budget tracking with category-based organization
- Product database with sustainability scoring
- Proper indexing for performance

## Security Considerations

- Use environment variables for sensitive configuration
- Implement proper input validation
- Use secure password hashing with bcrypt
- Include CSRF protection where needed
- Validate JWT tokens on protected routes

## Development Workflow

- Use the provided docker-compose.yml for local development
- Backend runs on port 5000, frontend on port 3000
- Mock data is included for development and testing
- Use the provided npm scripts for common tasks

## Feature Implementation Guide

When implementing new features:

1. **Backend**: Create route in appropriate blueprint, add to models if needed
2. **Frontend**: Create TypeScript interfaces, implement UI components with MUI
3. **Integration**: Use axios with proper error handling and loading states
4. **Testing**: Include basic error scenarios and edge cases

## Known Patterns

- Use `useAuth()` hook for authentication state
- Use Material-UI theme for consistent styling
- Implement responsive design with Material-UI Grid system
- Use React Context for global state management
- Include proper TypeScript types for all API responses

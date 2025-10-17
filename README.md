# Restaurant Booking Platform Backend

[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> A high-performance backend for a location-based restaurant booking platform that enables users to discover nearby restaurants, view menus, read reviews, and book tables seamlessly.

## Table of Contents

- [Features](#-features)
- [Documentation](#-documentation)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

## Features

- **Restaurant Discovery**
  - Geolocation-based search
  - Filter by cuisine, price range, and ratings
  - Real-time availability

- **User Experience**
  - Secure authentication & authorization
  - Booking management
  - Review and rating system

- **Admin Features**
  - Restaurant management
  - Booking oversight
  - User management

## Documentation

Explore our comprehensive documentation to understand the system architecture and development guidelines:

| Document | Description |
|----------|-------------|
| [Problem Statement](./docs/01_Phase1_Problem_Statement.md) | Project goals, scope, and use cases |
| [System Architecture](./docs/02_System_Architecture.md) | High-level architecture and components |
| [Database Schemas](./docs/03_Database_Schemas.md) | Data models and relationships |
| [API Design](./docs/04_API_Design.md) | Endpoint specifications and examples |
| [Geospatial Strategy](./docs/05_Geospatial_Strategy.md) | Location-based query implementation |
| [Booking Logic](./docs/06_Booking_Logic.md) | Reservation system design |
| [Deployment Guide](./docs/07_Deployment_and_Env.md) | Setup and deployment instructions |
| [Testing & Monitoring](./docs/08_Testing_and_Monitoring.md) | Testing strategy and monitoring |
| [Developer Guide](./docs/09_Developer_Guide.md) | Development setup and guidelines |
| [Contribution Guide](./docs/10_Contribution_Guide.md) | How to contribute to the project |

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Geolocation**: MongoDB Geospatial Queries
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest & Supertest

## Getting Started

### Prerequisites

- Node.js 16 or higher
- MongoDB 5.0 or higher
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/restaurant-booking-platform.git
   cd restaurant-booking-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the API**
   - API Base URL: `http://localhost:3000/api/v1`
   - API Docs: `http://localhost:3000/api-docs`

## Project Structure

```
backend/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── docs/           # Project documentation
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API route definitions
├── services/       # Business logic
├── tests/          # Test files
└── utils/          # Utility functions
```

## API Reference

For detailed API documentation, please refer to:
- [API Documentation](./docs/04_API_Design.md)
- Interactive API docs available at `http://localhost:3000/api-docs` when running locally

## Contributing

Contributions are welcome! Please read our [Contribution Guide](./docs/10_Contribution_Guide.md) for details on how to contribute to this project.

## Contact

Your Name - vishalthakur970820@gmail.com
Project Link: [https://github.com/Vishalthakur010/TASTE-AND-TRIAL](https://github.com/Vishalthakur010/TASTE-AND-TRIAL)
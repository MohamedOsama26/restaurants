# Restaurants API

A Node.js RESTful API for managing restaurant data.

## Features

- User authentication and authorization
- CRUD operations for restaurants and menus
- Input validation and error handling
- API documentation with Swagger

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js >= 14.x
- MongoDB instance

### Installation

1. Clone the repository:
   git clone https://github.com/MohamedOsama26/restaurants.git


2. Navigate to the project directory:
   cd restaurants


3. Install dependencies:
   npm install


4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

5. Start the server:
   npm start

## API Documentation

Access the API documentation at `http://localhost:3000/api-docs` after starting the server.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
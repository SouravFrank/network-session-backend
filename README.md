# Express Firebase App

This project is an Express.js application built with TypeScript that interacts with Firebase Realtime Database to manage network usage data. It provides two main APIs: one for retrieving network usage data and another for updating network usage data.

## Project Structure

```
express-firebase-app
├── src
│   ├── app.ts                     # Entry point of the application
│   ├── controllers
│   │   └── networkUsageController.ts # Handles API logic for network usage
│   ├── routes
│   │   └── networkUsageRoutes.ts   # Defines API routes for network usage
│   ├── services
│   │   └── firebaseService.ts       # Interacts with Firebase Realtime Database
│   ├── types
│   │   ├── apiResponse.ts           # Defines API response structure
│   │   └── updateNetworkUsageRequestBody.ts # Defines request body structure for updates
│   └── utils
│       └── logger.ts                # Logger utility for the application
├── package.json                     # NPM dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd express-firebase-app
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the application, run the following command:

```
npm start
```

The application will be available at `http://localhost:3000`.

## API Endpoints

### GET /api/network-usage

Fetches network usage data from the Firebase Realtime Database.

**Response:**
- 200 OK: Returns the network usage data.
- 500 Internal Server Error: If there is an error fetching the data.

### POST /api/network-usage

Updates network usage data in the Firebase Realtime Database.

**Request Body:**
```json
{
  "html": "string"
}
```

**Response:**
- 201 Created: Returns a success message and the processed data.
- 400 Bad Request: If the request body is missing or invalid.
- 500 Internal Server Error: If there is an error processing the data.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
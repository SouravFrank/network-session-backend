# 🚀 Express Firebase Network Usage App

A modern, TypeScript-based Express.js application for ingesting and managing network usage data in Firebase Realtime Database. Designed for reliability, observability, and easy integration with local or cloud-based data sources.

---

## 📁 Project Structure

```
wishnet-session-datastore
├── src
│   ├── app.ts                        # Main Express app entry point
│   ├── firebase.ts                   # Firebase client initialization
│   ├── controllers
│   │   └── networkUsageController.ts # API logic for network usage endpoints
│   ├── routes
│   │   └── networkUsageRoutes.ts     # Express routes for network usage APIs
│   ├── services
│   │   └── firebaseService.ts        # Firebase DB interaction logic
│   ├── types
│   │   ├── apiResponse.ts            # API response type definitions
│   │   ├── updateNetworkUsageRequestBody.ts # Request body type for updates
│   │   └── usageData.ts              # Usage data type definition
│   └── utils
│       ├── logger.ts                 # Winston logger with daily rotation
│       ├── mergeData.ts              # Data deduplication & merge logic
│       └── parser.ts                 # HTML parsing for usage data
├── fetch_and_post_html.sh            # Script: Pushes Wishnet usage HTML to API
├── package.json                      # NPM dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── .env                              # Environment variables (not committed)
├── .eslintrc.js                      # ESLint configuration
├── .prettierrc                       # Prettier configuration
└── README.md                         # Project documentation
```

---

## 🛠️ Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd wishnet-session-datastore
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Firebase credentials:
     ```
     API_KEY=your_api_key
     PROJECT_ID=your_project_id
     MESSAGING_SENDER_ID=your_messaging_sender_id
     APP_ID=your_app_id
     ```

---

## 🚦 Usage

### Start the Application

```sh
npm run build
npm start
```

The server will run at [http://localhost:8080](http://localhost:8080) (or your configured `PORT`).

---

## 🌐 API Endpoints

### `GET /api/network-usage`
Fetches all network usage data from Firebase.

- **Response:**  
  - `200 OK` with data array  
  - `500 Internal Server Error` on failure

### `POST /api/network-usage`
Updates network usage data in Firebase.  
**Request Body:**
```json
{
  "html": "<html>...</html>"
}
```
- **Response:**  
  - `201 Created` with processed data  
  - `400 Bad Request` if body is missing/invalid  
  - `500 Internal Server Error` on failure

### `GET /health`
Health check endpoint.

---

## 📝 Data Flow

- **HTML Usage Data** is fetched (e.g., from a local Wishnet router page).
- The HTML is parsed and deduplicated.
- Data is stored in Firebase Realtime Database.

---

## ⚡ Script: Push Wishnet Usage Data

The [`fetch_and_post_html.sh`](fetch_and_post_html.sh) script automates fetching HTML usage data from your local Wishnet router and POSTs it to your backend API for ingestion.

**Usage:**
```sh
bash fetch_and_post_html.sh
```
- The script fetches the HTML from your local network Wishnet usage API and pushes it to `/api/network-usage`.
- Make sure to update `SOURCE_URL` and API endpoint in the script as needed.

---

## 📦 NPM Scripts

From [`package.json`](package.json):

- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run the compiled app
- `npm run dev` — Run app in development mode with ts-node
- `npm run watch` — Watch and recompile TypeScript on changes

---

## 🧑‍💻 Contributing

Contributions are welcome!  
Open an issue or submit a pull request for improvements or bug fixes.

---

## 📄 License

MIT License

---
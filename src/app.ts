import express from 'express';
import bodyParser from 'body-parser';
import networkUsageRoutes from './routes/networkUsageRoutes';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({status: 'ok', message: 'Service is healthy'});
});

// Routes
app.use('/api', networkUsageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
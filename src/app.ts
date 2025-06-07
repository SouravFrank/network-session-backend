import express from 'express';
import bodyParser from 'body-parser';
import networkUsageRoutes from './routes/networkUsageRoutes';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', networkUsageRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
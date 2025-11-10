import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();

// Middleware
app.use(rateLimiter);
app.use(express.json());

// Routes
app.use('/api/transactions', transactionsRoute);

// Health-check endpoint (Render)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Init DB
await initDB();

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});

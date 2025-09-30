import express from 'express';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';

import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();

const app = express();

//Middleware to get this in post req  const { user_id, title, amount, category } = req.body;
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

app.use('/api/transactions/', transactionsRoute);

await initDB();

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});

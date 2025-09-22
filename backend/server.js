import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';

dotenv.config();

const app = express();
//Middleware to get this in post req  const { user_id, title, amount, category } = req.body;
app.use(express.json());

const PORT = process.env.PORT || 5001;

const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;
    console.log('Database initialized successfully');
  } catch (error) {
    console.log('Error initializing DB', error);
    process.exit(1);
  }
};

app.post('/api/transactions', async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const transaction = await sql`
    INSERT INTO transactions(user_id, title, amount, category)
    VALUES (${user_id},${title},${amount},${category})
    RETURNING *
`;
    console.log(transaction);

    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log('Error creating the transaction', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

await initDB();

app.listen(PORT, () => {
  console.log(`Server is up and running on PORT: ${PORT}`);
});

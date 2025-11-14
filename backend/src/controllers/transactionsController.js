import { sql } from '../config/db.js';

// GET /api/transactions/:userId
export const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await sql`
      SELECT id, user_id, title, amount, category
      FROM transactions
      WHERE user_id = ${userId}
      ORDER BY id DESC
    `;

    return res.status(200).json(transactions);
  } catch (error) {
    console.log('Error getting the transactions', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const inserted = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING id, user_id, title, amount, category
    `;

    return res.status(201).json(inserted[0]);
  } catch (error) {
    console.log('Error creating the transaction', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid transaction ID' });
    }

    const result = await sql`
      DELETE FROM transactions
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res
      .status(200)
      .json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.log('Error deleting the transaction', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/transactions/summary/:userId
export const getSummaryByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expenses
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    const balance = Number(balanceResult[0].balance);
    const income = Number(incomeResult[0].income);
    const expenses = Number(expensesResult[0].expenses);

    return res.status(200).json({ balance, income, expenses });
  } catch (error) {
    console.log('Error getting the summary', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

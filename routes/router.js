import express from 'express';
import { User, Transaction } from '../models/models.js';
import bcrypt from 'bcrypt';

const router = express.Router();
// Route for the homepage
router.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs view
  });
  // Render the registration page
router.get('/register', (req, res) => {
    res.render('register'); // Render the register.ejs view
  });
  
  // Render the login page
  router.get('/login', (req, res) => {
    res.render('login'); // Render the login.ejs view
  });
  router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    try {
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).render('register', { error: 'All fields are required' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
  
      // Pass user data to the dashboard view
      res.render('dashboard', {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        totalIncome: 0,
        totalBalance: 0,
        transactions: [],
      });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).render('register', { error: 'Error registering user' });
    }
  });
  
  
router.get('/test', async (req, res) => {
    try {
      const user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashed_password',
      });
      res.status(201).json({ message: 'Test user created successfully', user });
    } catch (error) {
      console.error('Error during test user creation:', error);
      res.status(500).json({ message: 'Error creating test user', error });
    }
  });
// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Get all transactions for a user
router.get('/transactions', async (req, res) => {
  const { userId } = req.query;
  try {
    const transactions = await Transaction.findAll({ where: { userId } });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

// Add a new transaction
router.post('/transactions', async (req, res) => {
  const { userId, amount, type } = req.body;
  try {
    const transaction = await Transaction.create({ userId, amount, type });
    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error adding transaction', error });
  }
});

// Update a transaction
router.put('/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { amount, type } = req.body;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.amount = amount;
    transaction.type = type;
    await transaction.save();

    res.status(200).json({ message: 'Transaction updated successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction', error });
  }
});

// Delete a transaction
router.delete('/transactions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
});

export default router;

import express from 'express';
import { User, Transaction } from '../models/models.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// Homepage route
router.get('/', (req, res) => {
  res.render('index'); // Render the index.ejs view
});

// Render registration page
router.get('/register', (req, res) => {
  res.render('register'); // Render the register.ejs view
});

// Render login page
router.get('/login', (req, res) => {
  res.render('login'); // Render the login.ejs view
});

// Handle user registration
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).render('register', { error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.redirect('/login'); // Redirect to login after successful registration
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).render('register', { error: 'Error registering user' });
  }
});

// Handle user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).render('login', { error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).render('login', { error: 'Invalid email or password' });
    }

    // Setting the user info in session
    req.session.userId = user.id;
    req.session.email = user.email;

    res.redirect('/dashboard'); // or wherever you want to redirect
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).render('login', { error: 'Error logging in' });
  }
});

// Dashboard route
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.session.userId; // Check if the user is logged in
    if (!userId) {
      return res.redirect('/login'); // Redirect to login if not authenticated
    }

    const user = await User.findByPk(userId); // Fetch user details
    const transactions = await Transaction.findAll({ where: { userId } });

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === 'add')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = transactions.reduce(
      (balance, t) => (t.type === 'add' ? balance + t.amount : balance - t.amount),
      0
    );

    // Render the dashboard view
    res.render('dashboard', {
      user,
      totalIncome,
      totalBalance,
      transactions,
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});



// Handle test user creation
router.get('/test', async (req, res) => {
  try {
    const user = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
    });
    res.status(201).json({ message: 'Test user created successfully', user });
  } catch (error) {
    console.error('Error during test user creation:', error);
    res.status(500).json({ message: 'Error creating test user', error });
  }
});

// Get all transactions for a user
router.get('/transactions', async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(403).send('Unauthorized');
    }

    const transactions = await Transaction.findAll({
      where: { userId },
      order: [['date', 'DESC']]
    });

    res.render('transactions', { transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});
  





// Add a new transaction
router.post('/transactions', async (req, res) => {
  const { amount, type } = req.body;

  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(403).send('Unauthorized');
    }

    if (!amount || !type) {
      return res.status(400).send('All fields are required');
    }

    // Create a new transaction
    await Transaction.create({ userId, amount, type });

    // Redirect back to the dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).send('Error adding transaction');
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
router.post('/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const { action } = req.query;

  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }

    if (action === 'delete') {
      await transaction.destroy();
      console.log(`Transaction ${id} deleted successfully.`);
    }

    res.redirect('/dashboard'); // Redirect back to dashboard
  } catch (error) {
    console.error('Error processing transaction action:', error);
    res.status(500).send('Error deleting transaction');
  }
});



router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.error('Logout Error:', err);
    }
    res.redirect('/');
  });
});


export default router;

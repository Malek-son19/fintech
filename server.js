import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import db from './config/db.js';
import router from './routes/router.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware for parsing cookies
app.use(cookieParser());

// Session Middleware
app.use(session({
  secret: 'your_secret_key', // This is the secret used to sign the session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(router);

// Sync database and start server
db.sync()
  .then(() => {
    console.log('Database connected successfully!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed. Please check your settings.');
    console.error(err);
    process.exit(1); // Exit the application on failure
  });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('وقت الانتحار');
});
console.log('Database Host:', process.env.DB_HOST);
console.log('JWT Secret:', process.env.JWT_SECRET);

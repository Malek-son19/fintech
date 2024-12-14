import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import db from './config/db.js';
import router from './routes/router.js';

const app = express();

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
    console.log('Database connected!');
    app.listen(process.env.PORT || 3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  })
  .catch(err => console.error('Error syncing database:', err));


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('وقت الانتحار');
});
console.log('Database Host:', process.env.DB_HOST);
console.log('JWT Secret:', process.env.JWT_SECRET);

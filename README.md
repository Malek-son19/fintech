# fintech

A personal finance tracker that helps users manage their financial transactions with ease. Users can add, edit, and delete transactions, track their total income, and view their financial summary. This project is connected to a MySQL database for data persistence.

Features
User authentication: Register and login functionality with secure password hashing.
Transaction management: Add, edit, and delete transactions.
Financial summaries: View total income and balance.
Database integration: All data is stored and retrieved from a MySQL database.
Technologies Used
Backend: Node.js, Express.js
Database: MySQL, Sequelize ORM
Frontend: EJS (Embedded JavaScript templates)
Middleware: cookie-parser, express-session, dotenv
Authentication: bcrypt for secure password hashing
Getting Started
Prerequisites
Ensure you have the following installed:

Node.js
MySQL
Installation
Clone this repository:
bash
Insert Code
Run
Copy code
git clone <repository-url>
cd fintech
Fintech Setup Instructions
Install Dependencies
Run the following command to install all necessary dependencies:

bash
Insert Code
Run
Copy code
npm install

# **Set Up Environment Variables**

Create a `.env` file in the root of your project and include the following:

```makefile
DB_NAME=<your-database-name>
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_HOST=<your-database-host>
PORT=3000
```
# **Set Up the MySQL Database**

1. Create a database in MySQL with the name you provided in `DB_NAME`.
2. The application will sync the database schema automatically on startup.

---

## **Start the Application**

Run the following command to start the application:

```bash
npm start
```
# **Open Your Browser and Navigate To**

```arduino
http://localhost:3000
```
# **Project Structure**

```php
fintech
│
├── config
│   └── db.js          # Database configuration
│
├── models
│   └── models.js      # Sequelize models for User and Transaction
│
├── routes
│   └── router.js      # Application routes
│
├── views              # EJS templates
│   ├── index.ejs      # Homepage
│   ├── login.ejs      # Login page
│   ├── register.ejs   # Register page
│   └── dashboard.ejs  # User dashboard
│
├── public
│   └── styles.css     # CSS for styling
│
├── server.js          # Application entry point
├── package.json       # Project dependencies
└── README.md
```
# **Usage**

1. Register a new account.
2. Log in with your credentials.
3. Use the dashboard to:
   - Add a new transaction (income, spend, or bills).
   - Edit or delete existing transactions.
   - View a summary of your total income and balance.

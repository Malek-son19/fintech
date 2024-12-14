import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // set to true to see SQL logs
});

sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.log('Error connecting to the database:', err));

export default sequelize;

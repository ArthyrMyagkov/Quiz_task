require('dotenv').config();

module.exports = {
  db: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  port: process.env.PORT || 5000,
};
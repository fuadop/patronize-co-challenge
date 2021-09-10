require('dotenv').config();

const dbConfig = {
  username: process.env.DB_USER || 'root',
  password: process.env.PASSWORD || null,
  database: process.env.DB || 'ligo_dev',
  host: process.env.HOST || 'localhost',
  dialect: 'mysql', 
};

export default dbConfig;

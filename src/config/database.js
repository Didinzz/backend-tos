require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  dialectModule: require('mysql2'),
  logging: false 
});

module.exports = sequelize; 
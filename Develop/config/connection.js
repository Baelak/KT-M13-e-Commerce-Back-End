require('dotenv').config();
const Sequelize = require('sequelize');

// Use environment variables or fallback to manual configuration
const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, {
      dialect: 'postgres',
      dialectOptions: {
        decimalNumbers: true,
      },
    })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: 'localhost',
      dialect: 'postgres',
      dialectOptions: {
        decimalNumbers: true,
      },
    });

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;

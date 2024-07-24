const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tech_blog_db', 'Stephen C', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;


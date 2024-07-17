const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = new Sequelize({
  dialect: 'postgres',
  storage: 'session',
  define: {
    timestamps: false,
  },
});

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

module.exports = User;

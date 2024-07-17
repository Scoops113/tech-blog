const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'postgres',
  storage: 'session',
  define: {
    timestamps: false,
  },
});

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = Comment;

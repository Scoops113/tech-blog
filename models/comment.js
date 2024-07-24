const { Model, DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Post, { foreignKey: 'post_id' });
      Comment.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      post_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Post',  // Ensure this matches your table name
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'User', 
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Comment',  
      timestamps: true,
      freezeTableName: true,
      underscored: true,
    }
  );

  return Comment;
};

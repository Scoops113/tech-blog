const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const UserModel = require('./user');
const PostModel = require('./post');
const CommentModel = require('./comment');

const User = UserModel(sequelize);
const Post = PostModel(sequelize);
const Comment = CommentModel(sequelize);

User.associate({ Post, Comment });
Post.associate({ User, Comment });
Comment.associate({ User, Post });

module.exports = { User, Post, Comment, sequelize };

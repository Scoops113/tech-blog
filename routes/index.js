const express = require('express');
const router = express.Router();

const { Post, User, Comment } = require('../models');


router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }, { model: Comment }],
      order: [['createdAt', 'DESC']],
    });
    res.render('home', { posts, session: req.session });
  } catch (error) {
    console.error(error);
    res.render('error');
  }
});

module.exports = router;

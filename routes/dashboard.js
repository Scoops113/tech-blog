const express = require('express');
const { Post } = require('../models');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId;
    const userPosts = await Post.findAll({ where: { userId } });
    res.render('dashboard', { userPosts, session: req.session });
  } catch (error) {
    console.error(error);
    res.render('error');
  }
});

module.exports = router;

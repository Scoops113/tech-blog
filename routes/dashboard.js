const express = require('express');
const router = express.Router();
const { Post } = require('../models');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

// Render dashboard with user's posts
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const posts = await Post.findAll({ where: { userId: req.session.userId } });
    res.render('dashboard', { posts, user: req.session.user });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});

// Render new post creation page
router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('new-post', { user: req.session.user });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Post, User } = require('../models');

// Middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}

// Render homepage with existing blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.render('home', { posts, user: req.session.user });
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.status(500).send('Error loading homepage');
  }
});

// Render login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Handle login submission
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && await user.checkPassword(password)) {
      req.session.userId = user.id;
      res.redirect('/'); // Redirect to homepage after login
    } else {
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).render('login', { error: 'Error logging in' });
  }
});

// Handle logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;

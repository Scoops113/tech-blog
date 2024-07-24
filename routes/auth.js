const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Route to render the registration page
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { username: username.trim() } });

    if (existingUser) {
      return res.status(400).render('register', { error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username.trim(),
      password: hashedPassword,
    });

    req.session.userId = newUser.id;
    res.redirect('/');
  } catch (error) {
    res.status(500).render('register', { error: 'An error occurred while registering the user' });
  }
});

// Route to render the login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Route to handle user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username: username.trim() } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).render('login', { error: 'Invalid username or password' });
    }

    req.session.userId = user.id;
    res.redirect('/'); // Redirect to homepage after login
  } catch (error) {
    res.status(500).render('login', { error: 'An error occurred while logging in the user' });
  }
});

// Route to handle user logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/');
  });
});

module.exports = router;

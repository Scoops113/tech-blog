const express = require('express');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const router = express.Router();


router.get('/login', (req, res) => {
  res.render('login');
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.render('login', { error: 'Invalid username or password' });
      return;
    }

    req.session.userId = user.id;
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error');
  }
});


router.get('/signup', (req, res) => {
  res.render('signup');
});


router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await User.create({ username, password });
    req.session.userId = newUser.id;
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error');
  }
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;

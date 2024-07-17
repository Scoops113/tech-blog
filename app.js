const express = require('express');
const session = require('express-session');
const path = require('path');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require('bcryptjs');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup with Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  storage: 'session',
  define: {
    timestamps: false,
  },
});
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));

// Database connection
const { User, Post, Comment } = require('./models');
sequelize.sync();

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const postsRouter = require('./routes/posts');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/posts', postsRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

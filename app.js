const express = require('express');
const session = require('express-session');
const path = require('path');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const exphbs = require('express-handlebars'); 
const hbs = exphbs.create({});

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session setup with Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  username: 'Stephen C',
  password: 'password',
  database: 'tech_blog_db',
  host: 'localhost',
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

// View engine setup
// app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
// app.set('view engine', 'handlebars');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Database connection and models setup
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

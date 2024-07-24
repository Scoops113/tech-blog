const express = require('express');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./models');
const morgan = require('morgan'); // For HTTP request logging

const app = express();

// Handlebars setup
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.handlebars',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// HTTP request logging
app.use(morgan('combined'));

// Session store setup
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: 'your_secret_key', // Replace with a strong secret
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));

// Route imports
const postRoutes = require('./routes/posts');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const homeRoutes = require('./routes/index');

// Middleware to ensure user is authenticated for protected routes
app.use((req, res, next) => {
  if (req.session.userId || req.path === '/auth/login' || req.path === '/auth/register' || req.path === '/') {
    return next();
  }
  res.redirect('/auth/login');
});

// Route definitions
app.use('/', homeRoutes);
app.use('/posts', postRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Error handling
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

app.use((err, req, res, next) => {
  console.error('Error stack trace:', err.stack); // Log error stack trace
  res.status(500).send('500 Internal Server Error');
});

// Sync the database and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT || 3000}`);
  });
});

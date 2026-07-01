require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

const constants = require('./config/constants');
const { ensureAdminSeeded } = require('./services/adminSeed');

ensureAdminSeeded();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.lang = req.cookies.lang || constants.DEFAULT_LANG;
  res.locals.siteName = { en: constants.SITE_NAME_EN, id: constants.SITE_NAME_ID };
  next();
});

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Abizar platform running at http://localhost:${PORT}`);
});

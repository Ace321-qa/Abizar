require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

const { ensureAdminSeeded } = require('./services/adminSeed');
const i18n = require('./middleware/i18n');
const siteMeta = require('./middleware/siteMeta');
const categoryLookup = require('./middleware/categoryLookup');

const publicRoutes = require('./routes/publicRoutes');
const contactRoutes = require('./routes/contactRoutes');
const topicRoutes = require('./routes/topicRoutes');
const articleRoutes = require('./routes/articleRoutes');
const ebookRoutes = require('./routes/ebookRoutes');
const videoRoutes = require('./routes/videoRoutes');
const audioRoutes = require('./routes/audioRoutes');
const pageRoutes = require('./routes/pageRoutes');

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

app.use(siteMeta);
app.use(i18n);
app.use(categoryLookup);

app.use('/', publicRoutes);
app.use('/', contactRoutes);
app.use('/', topicRoutes);
app.use('/articles', articleRoutes);
app.use('/ebooks', ebookRoutes);
app.use('/videos', videoRoutes);
app.use('/audios', audioRoutes);
app.use('/pages', pageRoutes);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Abizar platform running at http://localhost:${PORT}`);
});

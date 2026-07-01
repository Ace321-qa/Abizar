require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');

const { ensureAdminSeeded } = require('./services/adminSeed');
const i18n = require('./middleware/i18n');
const siteMeta = require('./middleware/siteMeta');
const categoryLookup = require('./middleware/categoryLookup');
const requireAdmin = require('./middleware/requireAdmin');

const publicRoutes = require('./routes/publicRoutes');
const contactRoutes = require('./routes/contactRoutes');
const topicRoutes = require('./routes/topicRoutes');
const articleRoutes = require('./routes/articleRoutes');
const ebookRoutes = require('./routes/ebookRoutes');
const videoRoutes = require('./routes/videoRoutes');
const audioRoutes = require('./routes/audioRoutes');
const pageRoutes = require('./routes/pageRoutes');
const adminAuthRoutes = require('./routes/admin/authRoutes');
const adminDashboardRoutes = require('./routes/admin/dashboardRoutes');
const pageAdminRoutes = require('./routes/admin/pageAdminRoutes');
const articleAdminRoutes = require('./routes/admin/articleAdminRoutes');
const ebookAdminRoutes = require('./routes/admin/ebookAdminRoutes');
const videoAdminRoutes = require('./routes/admin/videoAdminRoutes');
const audioAdminRoutes = require('./routes/admin/audioAdminRoutes');
const categoryAdminRoutes = require('./routes/admin/categoryAdminRoutes');

ensureAdminSeeded();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // switch to true once the app is served behind HTTPS in production
    maxAge: 8 * 60 * 60 * 1000,
  },
}));

app.use(siteMeta);
app.use(i18n);
app.use(categoryLookup);

app.use('/admin', adminAuthRoutes);
app.use('/admin', adminDashboardRoutes);
app.use('/admin/pages', requireAdmin, pageAdminRoutes);
app.use('/admin/articles', requireAdmin, articleAdminRoutes);
app.use('/admin/ebooks', requireAdmin, ebookAdminRoutes);
app.use('/admin/videos', requireAdmin, videoAdminRoutes);
app.use('/admin/audios', requireAdmin, audioAdminRoutes);
app.use('/admin/categories', requireAdmin, categoryAdminRoutes);

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

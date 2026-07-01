const jsonStore = require('../services/jsonStore');
const constants = require('../config/constants');

function published(items) {
  return items.filter((item) => item.published);
}

exports.home = (req, res) => {
  const lang = res.locals.lang;
  const articles = published(jsonStore.getAll('articles.json'))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);
  const ebooks = published(jsonStore.getAll('ebooks.json')).slice(0, 3);
  const videos = published(jsonStore.getAll('videos.json')).slice(0, 3);

  res.render('home', {
    title: lang === 'id' ? 'Beranda' : 'Home',
    articles,
    ebooks,
    videos,
  });
};

exports.about = (req, res) => {
  const page = jsonStore.getAll('pages.json').find((p) => p.slug === 'about' && p.published);
  res.render('about', {
    title: res.locals.lang === 'id' ? 'Tentang' : 'About',
    page,
  });
};

exports.contact = (req, res) => {
  const page = jsonStore.getAll('pages.json').find((p) => p.slug === 'contact' && p.published);
  const settings = jsonStore.readJSON('settings.json');
  res.render('contact', {
    title: res.locals.lang === 'id' ? 'Kontak' : 'Contact',
    page,
    socialLinks: settings.socialLinks || {},
  });
};

exports.topicsIndex = (req, res) => {
  const categories = jsonStore.getAll('categories.json');
  res.render('topics/index', {
    title: res.locals.lang === 'id' ? 'Topik' : 'Topics',
    categories,
  });
};

exports.topicsShow = (req, res) => {
  const { slug } = req.params;
  const category = jsonStore.getAll('categories.json').find((c) => c.slug === slug);
  if (!category) return res.status(404).send('Category not found');

  const inCategory = (item) => item.published && item.category === slug;

  res.render('topics/show', {
    title: res.locals.getLocalized(category, 'name', res.locals.lang),
    category,
    articles: jsonStore.getAll('articles.json').filter(inCategory),
    ebooks: jsonStore.getAll('ebooks.json').filter(inCategory),
    videos: jsonStore.getAll('videos.json').filter(inCategory),
    audios: jsonStore.getAll('audios.json').filter(inCategory),
  });
};

exports.setLang = (req, res) => {
  const { code } = req.params;
  if (constants.SUPPORTED_LANGS.includes(code)) {
    res.cookie('lang', code, { maxAge: 365 * 24 * 60 * 60 * 1000 });
  }
  res.redirect(req.get('Referer') || '/');
};

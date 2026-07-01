const jsonStore = require('../services/jsonStore');

exports.index = (req, res) => {
  const { category, tag } = req.query;
  let articles = jsonStore.getAll('articles.json').filter((a) => a.published);
  if (category) articles = articles.filter((a) => a.category === category);
  if (tag) articles = articles.filter((a) => Array.isArray(a.tags) && a.tags.includes(tag));
  articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.render('articles/index', {
    title: res.locals.lang === 'id' ? 'Esai' : 'Articles',
    articles,
    categories: jsonStore.getAll('categories.json'),
    activeCategory: category || null,
  });
};

exports.show = (req, res) => {
  const article = jsonStore
    .getAll('articles.json')
    .find((a) => a.slug === req.params.slug && a.published);
  if (!article) return res.status(404).send('Article not found');

  res.render('articles/show', {
    title: res.locals.getLocalized(article, 'title', res.locals.lang),
    article,
    shareUrl: `${process.env.SITE_URL || ''}${req.originalUrl}`,
  });
};

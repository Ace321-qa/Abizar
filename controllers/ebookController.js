const jsonStore = require('../services/jsonStore');

exports.index = (req, res) => {
  const { category, tag } = req.query;
  let ebooks = jsonStore.getAll('ebooks.json').filter((e) => e.published);
  if (category) ebooks = ebooks.filter((e) => e.category === category);
  if (tag) ebooks = ebooks.filter((e) => Array.isArray(e.tags) && e.tags.includes(tag));

  res.render('ebooks/index', {
    title: res.locals.lang === 'id' ? 'Ebook' : 'Ebooks',
    ebooks,
    categories: jsonStore.getAll('categories.json'),
    activeCategory: category || null,
  });
};

exports.show = (req, res) => {
  const ebook = jsonStore
    .getAll('ebooks.json')
    .find((e) => e.slug === req.params.slug && e.published);
  if (!ebook) return res.status(404).send('Ebook not found');

  res.render('ebooks/show', {
    title: res.locals.getLocalized(ebook, 'title', res.locals.lang),
    ebook,
  });
};

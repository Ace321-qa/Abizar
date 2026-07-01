const jsonStore = require('../services/jsonStore');

exports.show = (req, res) => {
  const page = jsonStore
    .getAll('pages.json')
    .find((p) => p.slug === req.params.slug && p.published);
  if (!page) return res.status(404).send('Page not found');

  res.render('pages/show', {
    title: res.locals.getLocalized(page, 'title', res.locals.lang),
    page,
  });
};

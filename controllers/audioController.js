const jsonStore = require('../services/jsonStore');

exports.index = (req, res) => {
  const { category, tag } = req.query;
  let audios = jsonStore.getAll('audios.json').filter((a) => a.published);
  if (category) audios = audios.filter((a) => a.category === category);
  if (tag) audios = audios.filter((a) => Array.isArray(a.tags) && a.tags.includes(tag));

  res.render('audios/index', {
    title: res.locals.lang === 'id' ? 'Audio' : 'Audios',
    audios,
    categories: jsonStore.getAll('categories.json'),
    activeCategory: category || null,
  });
};

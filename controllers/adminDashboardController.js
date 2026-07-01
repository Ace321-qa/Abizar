const jsonStore = require('../services/jsonStore');

exports.dashboard = (req, res) => {
  const counts = {
    pages: jsonStore.getAll('pages.json').length,
    articles: jsonStore.getAll('articles.json').length,
    ebooks: jsonStore.getAll('ebooks.json').length,
    videos: jsonStore.getAll('videos.json').length,
    audios: jsonStore.getAll('audios.json').length,
    categories: jsonStore.getAll('categories.json').length,
  };

  res.render('admin/dashboard', {
    title: 'Dashboard',
    isAdmin: true,
    layout: 'layouts/admin',
    counts,
  });
};

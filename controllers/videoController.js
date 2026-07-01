const jsonStore = require('../services/jsonStore');

function toEmbedUrl(youtubeUrl) {
  if (!youtubeUrl) return '';
  const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : youtubeUrl;
}

exports.index = (req, res) => {
  const { category, tag } = req.query;
  let videos = jsonStore.getAll('videos.json').filter((v) => v.published);
  if (category) videos = videos.filter((v) => v.category === category);
  if (tag) videos = videos.filter((v) => Array.isArray(v.tags) && v.tags.includes(tag));

  videos = videos.map((v) => ({ ...v, embedUrl: toEmbedUrl(v.youtubeUrl) }));

  res.render('videos/index', {
    title: res.locals.lang === 'id' ? 'Video' : 'Videos',
    videos,
    categories: jsonStore.getAll('categories.json'),
    activeCategory: category || null,
  });
};

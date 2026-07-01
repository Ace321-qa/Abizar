const jsonStore = require('../services/jsonStore');

const FILE = 'videos.json';

function toEmbedUrl(youtubeUrl) {
  if (!youtubeUrl) return '';
  const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : youtubeUrl;
}

exports.index = (req, res) => {
  const { category, tag } = req.query;
  let videos = jsonStore.getAll(FILE).filter((v) => v.published);
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

function validate(body) {
  const errors = [];
  if (!body.title_en || !body.title_en.trim()) errors.push('English title is required.');
  if (!body.youtubeUrl || !body.youtubeUrl.trim()) errors.push('YouTube URL is required.');
  return errors;
}

function fieldsFromBody(body) {
  return {
    title_en: body.title_en || '',
    title_id: body.title_id || '',
    description_en: body.description_en || '',
    description_id: body.description_id || '',
    youtubeUrl: body.youtubeUrl || '',
    thumbnail: body.thumbnail || '',
    category: body.category || '',
    tags: (body.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    published: body.published === 'on',
  };
}

exports.adminIndex = (req, res) => {
  const videos = jsonStore.getAll(FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.render('admin/videos/list', { title: 'Videos', isAdmin: true, layout: 'layouts/admin', videos });
};

exports.adminNewForm = (req, res) => {
  res.render('admin/videos/form', {
    title: 'New Video',
    isAdmin: true,
    layout: 'layouts/admin',
    video: {},
    categories: jsonStore.getAll('categories.json'),
    errors: [],
    formAction: '/admin/videos',
    httpMethod: 'POST',
  });
};

exports.adminCreate = (req, res) => {
  const errors = validate(req.body);

  if (errors.length) {
    return res.render('admin/videos/form', {
      title: 'New Video',
      isAdmin: true,
      layout: 'layouts/admin',
      video: req.body,
      categories: jsonStore.getAll('categories.json'),
      errors,
      formAction: '/admin/videos',
      httpMethod: 'POST',
    });
  }

  jsonStore.create(FILE, fieldsFromBody(req.body));
  res.redirect('/admin/videos');
};

exports.adminEditForm = (req, res) => {
  const video = jsonStore.getById(FILE, req.params.id);
  if (!video) return res.status(404).send('Video not found');

  res.render('admin/videos/form', {
    title: 'Edit Video',
    isAdmin: true,
    layout: 'layouts/admin',
    video,
    categories: jsonStore.getAll('categories.json'),
    errors: [],
    formAction: `/admin/videos/${video.id}`,
    httpMethod: 'PUT',
  });
};

exports.adminUpdate = (req, res) => {
  const video = jsonStore.getById(FILE, req.params.id);
  if (!video) return res.status(404).send('Video not found');

  const errors = validate(req.body);

  if (errors.length) {
    return res.render('admin/videos/form', {
      title: 'Edit Video',
      isAdmin: true,
      layout: 'layouts/admin',
      video: { ...video, ...req.body },
      categories: jsonStore.getAll('categories.json'),
      errors,
      formAction: `/admin/videos/${video.id}`,
      httpMethod: 'PUT',
    });
  }

  jsonStore.update(FILE, video.id, fieldsFromBody(req.body));
  res.redirect('/admin/videos');
};

exports.adminDelete = (req, res) => {
  jsonStore.remove(FILE, req.params.id);
  res.redirect('/admin/videos');
};

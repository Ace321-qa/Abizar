const jsonStore = require('../services/jsonStore');

const FILE = 'audios.json';

exports.index = (req, res) => {
  const { category, tag } = req.query;
  let audios = jsonStore.getAll(FILE).filter((a) => a.published);
  if (category) audios = audios.filter((a) => a.category === category);
  if (tag) audios = audios.filter((a) => Array.isArray(a.tags) && a.tags.includes(tag));

  res.render('audios/index', {
    title: res.locals.lang === 'id' ? 'Audio' : 'Audios',
    audios,
    categories: jsonStore.getAll('categories.json'),
    activeCategory: category || null,
  });
};

function validate(body) {
  const errors = [];
  if (!body.title_en || !body.title_en.trim()) errors.push('English title is required.');
  if (!body.audioUrl || !body.audioUrl.trim()) errors.push('Audio URL is required.');
  return errors;
}

function fieldsFromBody(body) {
  return {
    title_en: body.title_en || '',
    title_id: body.title_id || '',
    description_en: body.description_en || '',
    description_id: body.description_id || '',
    fileType: body.fileType === 'upload' ? 'upload' : 'link',
    audioUrl: body.audioUrl || '',
    category: body.category || '',
    tags: (body.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    published: body.published === 'on',
  };
}

exports.adminIndex = (req, res) => {
  const audios = jsonStore.getAll(FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.render('admin/audios/list', { title: 'Audios', isAdmin: true, layout: 'layouts/admin', audios });
};

exports.adminNewForm = (req, res) => {
  res.render('admin/audios/form', {
    title: 'New Audio',
    isAdmin: true,
    layout: 'layouts/admin',
    audio: {},
    categories: jsonStore.getAll('categories.json'),
    errors: [],
    formAction: '/admin/audios',
    httpMethod: 'POST',
  });
};

exports.adminCreate = (req, res) => {
  const errors = validate(req.body);

  if (errors.length) {
    return res.render('admin/audios/form', {
      title: 'New Audio',
      isAdmin: true,
      layout: 'layouts/admin',
      audio: req.body,
      categories: jsonStore.getAll('categories.json'),
      errors,
      formAction: '/admin/audios',
      httpMethod: 'POST',
    });
  }

  jsonStore.create(FILE, fieldsFromBody(req.body));
  res.redirect('/admin/audios');
};

exports.adminEditForm = (req, res) => {
  const audio = jsonStore.getById(FILE, req.params.id);
  if (!audio) return res.status(404).send('Audio not found');

  res.render('admin/audios/form', {
    title: 'Edit Audio',
    isAdmin: true,
    layout: 'layouts/admin',
    audio,
    categories: jsonStore.getAll('categories.json'),
    errors: [],
    formAction: `/admin/audios/${audio.id}`,
    httpMethod: 'PUT',
  });
};

exports.adminUpdate = (req, res) => {
  const audio = jsonStore.getById(FILE, req.params.id);
  if (!audio) return res.status(404).send('Audio not found');

  const errors = validate(req.body);

  if (errors.length) {
    return res.render('admin/audios/form', {
      title: 'Edit Audio',
      isAdmin: true,
      layout: 'layouts/admin',
      audio: { ...audio, ...req.body },
      categories: jsonStore.getAll('categories.json'),
      errors,
      formAction: `/admin/audios/${audio.id}`,
      httpMethod: 'PUT',
    });
  }

  jsonStore.update(FILE, audio.id, fieldsFromBody(req.body));
  res.redirect('/admin/audios');
};

exports.adminDelete = (req, res) => {
  jsonStore.remove(FILE, req.params.id);
  res.redirect('/admin/audios');
};

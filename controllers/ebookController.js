const jsonStore = require('../services/jsonStore');

const FILE = 'ebooks.json';

exports.index = (req, res) => {
  const { category, tag } = req.query;
  let ebooks = jsonStore.getAll(FILE).filter((e) => e.published);
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
    .getAll(FILE)
    .find((e) => e.slug === req.params.slug && e.published);
  if (!ebook) return res.status(404).send('Ebook not found');

  res.render('ebooks/show', {
    title: res.locals.getLocalized(ebook, 'title', res.locals.lang),
    ebook,
  });
};

function validate(body, items, currentId) {
  const errors = [];
  const slug = (body.slug || '').trim();

  if (!slug) errors.push('Slug is required.');
  if (!body.title_en || !body.title_en.trim()) errors.push('English title is required.');
  if (slug && items.some((e) => e.slug === slug && e.id !== currentId)) {
    errors.push('That slug is already in use by another ebook.');
  }

  return errors;
}

function fieldsFromBody(body) {
  return {
    slug: (body.slug || '').trim(),
    title_en: body.title_en || '',
    title_id: body.title_id || '',
    description_en: body.description_en || '',
    description_id: body.description_id || '',
    fileType: body.fileType === 'upload' ? 'upload' : 'link',
    fileUrl: body.fileUrl || '',
    coverImage: body.coverImage || '',
    category: body.category || '',
    tags: (body.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    gated: body.gated === 'on',
    published: body.published === 'on',
  };
}

exports.adminIndex = (req, res) => {
  const ebooks = jsonStore.getAll(FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.render('admin/ebooks/list', { title: 'Ebooks', isAdmin: true, layout: 'layouts/admin', ebooks });
};

exports.adminNewForm = (req, res) => {
  res.render('admin/ebooks/form', {
    title: 'New Ebook',
    isAdmin: true,
    layout: 'layouts/admin',
    ebook: {},
    categories: jsonStore.getAll('categories.json'),
    errors: [],
    formAction: '/admin/ebooks',
    httpMethod: 'POST',
  });
};

exports.adminCreate = (req, res) => {
  const items = jsonStore.getAll(FILE);
  const errors = validate(req.body, items, null);

  if (errors.length) {
    return res.render('admin/ebooks/form', {
      title: 'New Ebook',
      isAdmin: true,
      layout: 'layouts/admin',
      ebook: req.body,
      categories: jsonStore.getAll('categories.json'),
      errors,
      formAction: '/admin/ebooks',
      httpMethod: 'POST',
    });
  }

  jsonStore.create(FILE, fieldsFromBody(req.body));
  res.redirect('/admin/ebooks');
};

exports.adminEditForm = (req, res) => {
  const ebook = jsonStore.getById(FILE, req.params.id);
  if (!ebook) return res.status(404).send('Ebook not found');

  res.render('admin/ebooks/form', {
    title: 'Edit Ebook',
    isAdmin: true,
    layout: 'layouts/admin',
    ebook,
    categories: jsonStore.getAll('categories.json'),
    errors: [],
    formAction: `/admin/ebooks/${ebook.id}`,
    httpMethod: 'PUT',
  });
};

exports.adminUpdate = (req, res) => {
  const ebook = jsonStore.getById(FILE, req.params.id);
  if (!ebook) return res.status(404).send('Ebook not found');

  const items = jsonStore.getAll(FILE);
  const errors = validate(req.body, items, ebook.id);

  if (errors.length) {
    return res.render('admin/ebooks/form', {
      title: 'Edit Ebook',
      isAdmin: true,
      layout: 'layouts/admin',
      ebook: { ...ebook, ...req.body },
      categories: jsonStore.getAll('categories.json'),
      errors,
      formAction: `/admin/ebooks/${ebook.id}`,
      httpMethod: 'PUT',
    });
  }

  jsonStore.update(FILE, ebook.id, fieldsFromBody(req.body));
  res.redirect('/admin/ebooks');
};

exports.adminDelete = (req, res) => {
  jsonStore.remove(FILE, req.params.id);
  res.redirect('/admin/ebooks');
};

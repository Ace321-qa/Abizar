const jsonStore = require('../services/jsonStore');

const FILE = 'pages.json';

exports.show = (req, res) => {
  const page = jsonStore
    .getAll(FILE)
    .find((p) => p.slug === req.params.slug && p.published);
  if (!page) return res.status(404).send('Page not found');

  res.render('pages/show', {
    title: res.locals.getLocalized(page, 'title', res.locals.lang),
    page,
  });
};

function validate(body, items, currentId) {
  const errors = [];
  const slug = (body.slug || '').trim();

  if (!slug) errors.push('Slug is required.');
  if (!body.title_en || !body.title_en.trim()) errors.push('English title is required.');
  if (slug && items.some((p) => p.slug === slug && p.id !== currentId)) {
    errors.push('That slug is already in use by another page.');
  }

  return errors;
}

function fieldsFromBody(body) {
  return {
    slug: (body.slug || '').trim(),
    title_en: body.title_en || '',
    title_id: body.title_id || '',
    content_en: body.content_en || '',
    content_id: body.content_id || '',
    metaDescription_en: body.metaDescription_en || '',
    metaDescription_id: body.metaDescription_id || '',
    published: body.published === 'on',
  };
}

exports.adminIndex = (req, res) => {
  const pages = jsonStore.getAll(FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.render('admin/pages/list', { title: 'Pages', isAdmin: true, layout: 'layouts/admin', pages });
};

exports.adminNewForm = (req, res) => {
  res.render('admin/pages/form', {
    title: 'New Page',
    isAdmin: true,
    layout: 'layouts/admin',
    page: {},
    errors: [],
    formAction: '/admin/pages',
    httpMethod: 'POST',
  });
};

exports.adminCreate = (req, res) => {
  const items = jsonStore.getAll(FILE);
  const errors = validate(req.body, items, null);

  if (errors.length) {
    return res.render('admin/pages/form', {
      title: 'New Page',
      isAdmin: true,
      layout: 'layouts/admin',
      page: req.body,
      errors,
      formAction: '/admin/pages',
      httpMethod: 'POST',
    });
  }

  jsonStore.create(FILE, fieldsFromBody(req.body));
  res.redirect('/admin/pages');
};

exports.adminEditForm = (req, res) => {
  const page = jsonStore.getById(FILE, req.params.id);
  if (!page) return res.status(404).send('Page not found');

  res.render('admin/pages/form', {
    title: 'Edit Page',
    isAdmin: true,
    layout: 'layouts/admin',
    page,
    errors: [],
    formAction: `/admin/pages/${page.id}`,
    httpMethod: 'PUT',
  });
};

exports.adminUpdate = (req, res) => {
  const page = jsonStore.getById(FILE, req.params.id);
  if (!page) return res.status(404).send('Page not found');

  const items = jsonStore.getAll(FILE);
  const errors = validate(req.body, items, page.id);

  if (errors.length) {
    return res.render('admin/pages/form', {
      title: 'Edit Page',
      isAdmin: true,
      layout: 'layouts/admin',
      page: { ...page, ...req.body },
      errors,
      formAction: `/admin/pages/${page.id}`,
      httpMethod: 'PUT',
    });
  }

  jsonStore.update(FILE, page.id, fieldsFromBody(req.body));
  res.redirect('/admin/pages');
};

exports.adminDelete = (req, res) => {
  jsonStore.remove(FILE, req.params.id);
  res.redirect('/admin/pages');
};

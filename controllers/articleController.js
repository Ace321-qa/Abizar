const jsonStore = require('../services/jsonStore');
const { estimateMinutes } = require('../utils/readingTime');

const FILE = 'articles.json';

exports.index = (req, res) => {
  const { category, tag } = req.query;
  let articles = jsonStore.getAll(FILE).filter((a) => a.published);
  if (category) articles = articles.filter((a) => a.category === category);
  if (tag) articles = articles.filter((a) => Array.isArray(a.tags) && a.tags.includes(tag));
  articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.render('articles/index', {
    title: res.locals.lang === 'id' ? 'Esai' : 'Essays',
    articles,
    categories: jsonStore.getAll('categories.json'),
    activeCategory: category || null,
  });
};

exports.show = (req, res) => {
  const article = jsonStore
    .getAll(FILE)
    .find((a) => a.slug === req.params.slug && a.published);
  if (!article) return res.status(404).send('Essay not found');

  res.render('articles/show', {
    title: res.locals.getLocalized(article, 'title', res.locals.lang),
    article,
    shareUrl: `${process.env.SITE_URL || ''}${req.originalUrl}`,
  });
};

function validate(body, items, currentId) {
  const errors = [];
  const slug = (body.slug || '').trim();

  if (!slug) errors.push('Slug is required.');
  if (!body.title_en || !body.title_en.trim()) errors.push('English title is required.');
  if (slug && items.some((a) => a.slug === slug && a.id !== currentId)) {
    errors.push('That slug is already in use by another essay.');
  }

  return errors;
}

function fieldsFromBody(body) {
  const minutesEn = estimateMinutes(body.content_en);
  const minutesId = estimateMinutes(body.content_id);

  return {
    slug: (body.slug || '').trim(),
    title_en: body.title_en || '',
    title_id: body.title_id || '',
    excerpt_en: body.excerpt_en || '',
    excerpt_id: body.excerpt_id || '',
    content_en: body.content_en || '',
    content_id: body.content_id || '',
    coverImage: body.coverImage || '',
    category: body.category || '',
    tags: (body.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
    published: body.published === 'on',
    commentsEnabled: body.commentsEnabled === 'on',
    readingTime_en: minutesEn ? `${minutesEn} min read` : '',
    readingTime_id: minutesId ? `${minutesId} menit baca` : '',
  };
}

exports.adminIndex = (req, res) => {
  const articles = jsonStore.getAll(FILE).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.render('admin/articles/list', { title: 'Essays', isAdmin: true, layout: 'layouts/admin', articles });
};

exports.adminNewForm = (req, res) => {
  res.render('admin/articles/form', {
    title: 'New Essay',
    isAdmin: true,
    layout: 'layouts/admin',
    article: {},
    categories: jsonStore.getAll('categories.json'),
    errors: [],
    formAction: '/admin/articles',
    httpMethod: 'POST',
  });
};

exports.adminCreate = (req, res) => {
  const items = jsonStore.getAll(FILE);
  const errors = validate(req.body, items, null);

  if (errors.length) {
    return res.render('admin/articles/form', {
      title: 'New Essay',
      isAdmin: true,
      layout: 'layouts/admin',
      article: req.body,
      categories: jsonStore.getAll('categories.json'),
      errors,
      formAction: '/admin/articles',
      httpMethod: 'POST',
    });
  }

  jsonStore.create(FILE, fieldsFromBody(req.body));
  res.redirect('/admin/articles');
};

exports.adminEditForm = (req, res) => {
  const article = jsonStore.getById(FILE, req.params.id);
  if (!article) return res.status(404).send('Essay not found');

  res.render('admin/articles/form', {
    title: 'Edit Essay',
    isAdmin: true,
    layout: 'layouts/admin',
    article,
    categories: jsonStore.getAll('categories.json'),
    errors: [],
    formAction: `/admin/articles/${article.id}`,
    httpMethod: 'PUT',
  });
};

exports.adminUpdate = (req, res) => {
  const article = jsonStore.getById(FILE, req.params.id);
  if (!article) return res.status(404).send('Essay not found');

  const items = jsonStore.getAll(FILE);
  const errors = validate(req.body, items, article.id);

  if (errors.length) {
    return res.render('admin/articles/form', {
      title: 'Edit Essay',
      isAdmin: true,
      layout: 'layouts/admin',
      article: { ...article, ...req.body },
      categories: jsonStore.getAll('categories.json'),
      errors,
      formAction: `/admin/articles/${article.id}`,
      httpMethod: 'PUT',
    });
  }

  jsonStore.update(FILE, article.id, fieldsFromBody(req.body));
  res.redirect('/admin/articles');
};

exports.adminDelete = (req, res) => {
  jsonStore.remove(FILE, req.params.id);
  res.redirect('/admin/articles');
};

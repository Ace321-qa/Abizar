const jsonStore = require('../services/jsonStore');

const FILE = 'categories.json';
const CONTENT_FILES = ['articles.json', 'ebooks.json', 'videos.json', 'audios.json'];

function validate(body, items, currentId) {
  const errors = [];
  const slug = (body.slug || '').trim();

  if (!slug) errors.push('Slug is required.');
  if (!body.name_en || !body.name_en.trim()) errors.push('English name is required.');
  if (slug && items.some((c) => c.slug === slug && c.id !== currentId)) {
    errors.push('That slug is already in use by another category.');
  }

  return errors;
}

function fieldsFromBody(body) {
  return {
    slug: (body.slug || '').trim(),
    name_en: body.name_en || '',
    name_id: body.name_id || '',
    description_en: body.description_en || '',
    description_id: body.description_id || '',
  };
}

function countUsage(slug) {
  return CONTENT_FILES.reduce((total, file) => {
    return total + jsonStore.getAll(file).filter((item) => item.category === slug).length;
  }, 0);
}

exports.adminIndex = (req, res) => {
  const categories = jsonStore.getAll(FILE).sort((a, b) => a.name_en.localeCompare(b.name_en));
  const categoriesWithUsage = categories.map((c) => ({ ...c, usageCount: countUsage(c.slug) }));

  res.render('admin/categories/list', {
    title: 'Categories',
    isAdmin: true,
    layout: 'layouts/admin',
    categories: categoriesWithUsage,
  });
};

exports.adminNewForm = (req, res) => {
  res.render('admin/categories/form', {
    title: 'New Category',
    isAdmin: true,
    layout: 'layouts/admin',
    category: {},
    errors: [],
    formAction: '/admin/categories',
    httpMethod: 'POST',
  });
};

exports.adminCreate = (req, res) => {
  const items = jsonStore.getAll(FILE);
  const errors = validate(req.body, items, null);

  if (errors.length) {
    return res.render('admin/categories/form', {
      title: 'New Category',
      isAdmin: true,
      layout: 'layouts/admin',
      category: req.body,
      errors,
      formAction: '/admin/categories',
      httpMethod: 'POST',
    });
  }

  jsonStore.create(FILE, fieldsFromBody(req.body));
  res.redirect('/admin/categories');
};

exports.adminEditForm = (req, res) => {
  const category = jsonStore.getById(FILE, req.params.id);
  if (!category) return res.status(404).send('Category not found');

  res.render('admin/categories/form', {
    title: 'Edit Category',
    isAdmin: true,
    layout: 'layouts/admin',
    category,
    errors: [],
    formAction: `/admin/categories/${category.id}`,
    httpMethod: 'PUT',
  });
};

exports.adminUpdate = (req, res) => {
  const category = jsonStore.getById(FILE, req.params.id);
  if (!category) return res.status(404).send('Category not found');

  const items = jsonStore.getAll(FILE);
  const errors = validate(req.body, items, category.id);

  if (errors.length) {
    return res.render('admin/categories/form', {
      title: 'Edit Category',
      isAdmin: true,
      layout: 'layouts/admin',
      category: { ...category, ...req.body },
      errors,
      formAction: `/admin/categories/${category.id}`,
      httpMethod: 'PUT',
    });
  }

  const oldSlug = category.slug;
  const updated = jsonStore.update(FILE, category.id, fieldsFromBody(req.body));

  if (oldSlug !== updated.slug) {
    CONTENT_FILES.forEach((file) => {
      jsonStore.getAll(file).forEach((item) => {
        if (item.category === oldSlug) {
          jsonStore.update(file, item.id, { category: updated.slug });
        }
      });
    });
  }

  res.redirect('/admin/categories');
};

exports.adminDeleteConfirm = (req, res) => {
  const category = jsonStore.getById(FILE, req.params.id);
  if (!category) return res.status(404).send('Category not found');

  res.render('admin/categories/delete-confirm', {
    title: 'Delete Category',
    isAdmin: true,
    layout: 'layouts/admin',
    category,
    usageCount: countUsage(category.slug),
    otherCategories: jsonStore.getAll(FILE).filter((c) => c.id !== category.id),
  });
};

exports.adminDelete = (req, res) => {
  const category = jsonStore.getById(FILE, req.params.id);
  if (!category) return res.status(404).send('Category not found');

  const reassignTo = (req.body.reassignTo || '').trim();

  CONTENT_FILES.forEach((file) => {
    jsonStore.getAll(file).forEach((item) => {
      if (item.category === category.slug) {
        jsonStore.update(file, item.id, { category: reassignTo });
      }
    });
  });

  jsonStore.remove(FILE, category.id);
  res.redirect('/admin/categories');
};

const jsonStore = require('../services/jsonStore');
const { getLocalized } = require('../utils/i18nHelper');

module.exports = function categoryLookup(req, res, next) {
  const categories = jsonStore.getAll('categories.json');

  res.locals.getCategoryName = (slug, lang) => {
    const category = categories.find((c) => c.slug === slug);
    return category ? getLocalized(category, 'name', lang) : '';
  };

  next();
};

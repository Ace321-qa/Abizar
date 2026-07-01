const jsonStore = require('../services/jsonStore');

module.exports = function siteMeta(req, res, next) {
  const settings = jsonStore.readJSON('settings.json');
  const meta = settings.siteMeta || {};

  res.locals.siteName = { en: meta.siteName_en || '', id: meta.siteName_id || '' };
  res.locals.siteTagline = {
    en: meta.tagline_en || '',
    id: meta.tagline_id || '',
  };
  res.locals.socialLinks = settings.socialLinks || {};
  next();
};

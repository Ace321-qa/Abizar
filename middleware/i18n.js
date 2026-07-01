const constants = require('../config/constants');
const { getLocalized } = require('../utils/i18nHelper');

module.exports = function i18n(req, res, next) {
  const queryLang = req.query.lang;
  const cookieLang = req.cookies.lang;

  let lang = constants.DEFAULT_LANG;
  if (constants.SUPPORTED_LANGS.includes(queryLang)) {
    lang = queryLang;
  } else if (constants.SUPPORTED_LANGS.includes(cookieLang)) {
    lang = cookieLang;
  }

  res.locals.lang = lang;
  res.locals.getLocalized = getLocalized;
  next();
};

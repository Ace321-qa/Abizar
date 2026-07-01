function getLocalized(item, field, lang) {
  if (!item) return '';
  return item[`${field}_${lang}`] || item[`${field}_en`] || '';
}

module.exports = { getLocalized };

require('dotenv').config();

module.exports = {
  DEFAULT_LANG: 'en',
  SUPPORTED_LANGS: ['en', 'id'],
  MAX_UPLOAD_MB: parseInt(process.env.MAX_UPLOAD_MB, 10) || 25,
  SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
};

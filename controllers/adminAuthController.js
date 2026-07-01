const jsonStore = require('../services/jsonStore');
const bcrypt = require('bcrypt');

exports.loginForm = (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin/dashboard');
  res.render('admin/login', {
    title: 'Admin Login',
    error: null,
    isAdmin: false,
    layout: 'layouts/admin',
  });
};

exports.login = (req, res) => {
  const { password } = req.body;
  const admin = jsonStore.readJSON('admin.json');

  if (!password || !bcrypt.compareSync(password, admin.passwordHash)) {
    return res.render('admin/login', {
      title: 'Admin Login',
      error: 'Incorrect password.',
      isAdmin: false,
      layout: 'layouts/admin',
    });
  }

  req.session.isAdmin = true;
  res.redirect('/admin/dashboard');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

exports.dashboard = (req, res) => {
  res.render('admin/dashboard', {
    title: 'Dashboard',
    isAdmin: true,
    layout: 'layouts/admin',
  });
};

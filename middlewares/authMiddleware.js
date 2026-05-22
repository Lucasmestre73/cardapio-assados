exports.adminRequired = (req, res, next) => {
  if (!req.session.admin) {
    req.flash('errors', 'Faca login para acessar a area administrativa');
    return res.redirect('/admin/login');
  }

  return next();
};

exports.redirectLoggedAdmin = (req, res, next) => {
  if (req.session.admin) return res.redirect('/admin');
  return next();
};

const Admin = require('../models/Admin');

exports.loginPage = async (req, res) => {
  if (req.session.admin) return res.redirect('/admin');

  const hasAdmin = await Admin.exists();
  res.render('admin/login', { hasAdmin });
};

exports.login = async (req, res) => {
  const user = String(req.body.user || '').trim();
  const password = String(req.body.password || '');

  const admin = await Admin.findOne({ user });
  if (!admin || !(await admin.comparePassword(password))) {
    req.flash('errors', 'Usuario ou senha invalidos');
    return res.redirect('/admin/login');
  }

  req.session.admin = {
    id: admin._id.toString(),
    user: admin.user
  };

  req.flash('success', 'Login realizado com sucesso');
  return res.redirect('/admin');
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
};

exports.setupPage = async (req, res) => {
  const hasAdmin = await Admin.exists();
  if (hasAdmin) return res.redirect('/admin/login');

  return res.render('admin/setup');
};

exports.setup = async (req, res) => {
  const hasAdmin = await Admin.exists();
  if (hasAdmin) return res.redirect('/admin/login');

  const user = String(req.body.user || '').trim();
  const password = String(req.body.password || '');

  if (!user || !password || password.length < 6) {
    req.flash('errors', 'Informe usuario e senha com pelo menos 6 caracteres');
    return res.redirect('/admin/setup');
  }

  await Admin.create({ user, password });
  req.flash('success', 'Administrador criado. Faca login para continuar.');
  return res.redirect('/admin/login');
};

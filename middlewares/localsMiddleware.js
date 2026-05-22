module.exports = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.admin = req.session.admin || null;
  res.locals.formatMoney = (value) => Number(value || 0).toFixed(2).replace('.', ',');
  res.locals.tipoVendaLabel = {
    kg: 'por kg',
    unidade: 'unidade',
    porcao: 'porcao',
    marmita: 'marmita',
    outro: 'outro'
  };
  next();
};

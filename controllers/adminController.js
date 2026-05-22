const Prato = require('../models/Prato');
const CardapioDoDia = require('../models/CardapioDoDia');
const { getInicioDoDia } = require('../utils/date');

exports.dashboard = async (req, res) => {
  const [totalPratos, pratosAtivos, cardapio] = await Promise.all([
    Prato.countDocuments(),
    Prato.countDocuments({ ativo: true }),
    CardapioDoDia.findOne({ data: getInicioDoDia() })
  ]);

  res.render('admin/dashboard', {
    totalPratos,
    pratosAtivos,
    totalItensHoje: cardapio ? cardapio.itens.length : 0
  });
};

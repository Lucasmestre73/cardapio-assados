const CardapioDoDia = require('../models/CardapioDoDia');
const { getInicioDoDia } = require('../utils/date');

exports.home = async (req, res) => {
  const hoje = getInicioDoDia();
  const cardapio = await CardapioDoDia.findOne({ data: hoje }).populate('itens.prato');

  res.render('home', {
    cardapio,
    itens: cardapio ? cardapio.itens.filter((item) => item.prato && item.prato.ativo) : []
  });
};

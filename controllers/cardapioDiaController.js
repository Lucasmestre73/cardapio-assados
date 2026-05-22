const Prato = require('../models/Prato');
const CardapioDoDia = require('../models/CardapioDoDia');
const { getInicioDoDia } = require('../utils/date');

async function getCardapioHoje() {
  const hoje = getInicioDoDia();
  let cardapio = await CardapioDoDia.findOne({ data: hoje }).populate('itens.prato');

  if (!cardapio) {
    cardapio = await CardapioDoDia.create({ data: hoje, itens: [] });
    cardapio = await cardapio.populate('itens.prato');
  }

  return cardapio;
}

exports.index = async (req, res) => {
  const busca = String(req.query.busca || '').trim();
  const filtroPratos = {
    ativo: true,
    ...(busca ? { nome: new RegExp(busca, 'i') } : {})
  };

  const [cardapio, pratos] = await Promise.all([
    getCardapioHoje(),
    Prato.find(filtroPratos).sort({ nome: 1 })
  ]);

  res.render('admin/cardapio/index', { cardapio, pratos, busca });
};

exports.adicionar = async (req, res) => {
  const prato = await Prato.findById(req.body.pratoId);
  if (!prato) {
    req.flash('errors', 'Prato nao encontrado');
    return res.redirect('/admin/cardapio');
  }

  const cardapio = await getCardapioHoje();
  const jaExiste = cardapio.itens.some((item) => item.prato && item.prato._id.equals(prato._id));

  if (jaExiste) {
    req.flash('errors', 'Esse prato ja esta no cardapio de hoje');
    return res.redirect('/admin/cardapio');
  }

  cardapio.itens.push({
    prato: prato._id,
    preco: prato.precoPadrao,
    tipoVenda: prato.tipoVendaPadrao,
    disponivel: true,
    observacao: ''
  });

  await cardapio.save();
  req.flash('success', 'Prato adicionado ao cardapio do dia');
  return res.redirect('/admin/cardapio');
};

exports.editarItem = async (req, res) => {
  const cardapio = await CardapioDoDia.findOne({ 'itens._id': req.params.id });
  if (!cardapio) {
    req.flash('errors', 'Item nao encontrado');
    return res.redirect('/admin/cardapio');
  }

  const item = cardapio.itens.id(req.params.id);
  item.preco = Number(String(req.body.preco || '').replace(',', '.'));
  item.tipoVenda = req.body.tipoVenda;
  item.disponivel = req.body.disponivel === 'on';
  item.observacao = String(req.body.observacao || '').trim();

  if (Number.isNaN(item.preco) || item.preco < 0) {
    req.flash('errors', 'Preco do dia invalido');
    return res.redirect('/admin/cardapio');
  }

  await cardapio.save();
  req.flash('success', 'Item atualizado');
  return res.redirect('/admin/cardapio');
};

exports.removerItem = async (req, res) => {
  const cardapio = await CardapioDoDia.findOne({ 'itens._id': req.params.id });
  if (!cardapio) {
    req.flash('errors', 'Item nao encontrado');
    return res.redirect('/admin/cardapio');
  }

  cardapio.itens.pull({ _id: req.params.id });
  await cardapio.save();
  req.flash('success', 'Item removido do cardapio do dia');
  return res.redirect('/admin/cardapio');
};

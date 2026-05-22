const Prato = require('../models/Prato');

function normalizarPrato(body, file, imagemAtual = '') {
  return {
    nome: String(body.nome || '').trim(),
    descricao: String(body.descricao || '').trim(),
    modoPreparo: String(body.modoPreparo || '').trim(),
    imagem: file ? file.path : imagemAtual,
    categoria: body.categoria,
    tipoVendaPadrao: body.tipoVendaPadrao,
    precoPadrao: Number(String(body.precoPadrao || '').replace(',', '.')),
    ativo: body.ativo === 'on'
  };
}

function validarPrato(prato) {
  const errors = [];
  if (!prato.nome) errors.push('Nome do prato e obrigatorio');
  if (!prato.descricao) errors.push('Descricao e obrigatoria');
  if (!prato.modoPreparo) errors.push('Modo de preparo e obrigatorio');
  if (!prato.categoria) errors.push('Categoria e obrigatoria');
  if (!prato.tipoVendaPadrao) errors.push('Tipo de venda padrao e obrigatorio');
  if (Number.isNaN(prato.precoPadrao) || prato.precoPadrao < 0) errors.push('Preco padrao invalido');
  return errors;
}

exports.index = async (req, res) => {
  const busca = String(req.query.busca || '').trim();
  const filtro = busca ? { nome: new RegExp(busca, 'i') } : {};
  const pratos = await Prato.find(filtro).sort({ criadoEm: -1 });

  res.render('admin/pratos/index', { pratos, busca });
};

exports.novoPage = (req, res) => {
  res.render('admin/pratos/form', { prato: null, action: '/admin/pratos/novo' });
};

exports.criar = async (req, res) => {
  const prato = normalizarPrato(req.body, req.file);
  const errors = validarPrato(prato);

  if (errors.length) {
    req.flash('errors', errors);
    return res.redirect('/admin/pratos/novo');
  }

  await Prato.create(prato);
  req.flash('success', 'Prato cadastrado com sucesso');
  return res.redirect('/admin/pratos');
};

exports.editarPage = async (req, res) => {
  const prato = await Prato.findById(req.params.id);
  if (!prato) {
    req.flash('errors', 'Prato nao encontrado');
    return res.redirect('/admin/pratos');
  }

  return res.render('admin/pratos/form', { prato, action: `/admin/pratos/editar/${prato._id}` });
};

exports.atualizar = async (req, res) => {
  const pratoAtual = await Prato.findById(req.params.id);
  if (!pratoAtual) {
    req.flash('errors', 'Prato nao encontrado');
    return res.redirect('/admin/pratos');
  }

  const prato = normalizarPrato(req.body, req.file, pratoAtual.imagem);
  const errors = validarPrato(prato);

  if (errors.length) {
    req.flash('errors', errors);
    return res.redirect(`/admin/pratos/editar/${req.params.id}`);
  }

  await Prato.findByIdAndUpdate(req.params.id, prato);
  req.flash('success', 'Prato atualizado com sucesso');
  return res.redirect('/admin/pratos');
};

exports.excluir = async (req, res) => {
  await Prato.findByIdAndDelete(req.params.id);
  req.flash('success', 'Prato excluido');
  return res.redirect('/admin/pratos');
};

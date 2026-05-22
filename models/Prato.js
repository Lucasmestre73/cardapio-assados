const mongoose = require('mongoose');

const pratoSchema = new mongoose.Schema({
  nome: { type: String, required: true, trim: true },
  descricao: { type: String, required: true, trim: true },
  modoPreparo: { type: String, required: true, trim: true },
  imagem: { type: String, default: '' },
  categoria: {
    type: String,
    enum: ['carnes', 'acompanhamentos', 'bebidas', 'sobremesas', 'outro'],
    required: true
  },
  tipoVendaPadrao: {
    type: String,
    enum: ['kg', 'unidade', 'porcao', 'marmita', 'outro'],
    required: true
  },
  precoPadrao: { type: Number, required: true, min: 0 },
  ativo: { type: Boolean, default: true },
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prato', pratoSchema);

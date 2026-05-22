const mongoose = require('mongoose');

const itemCardapioSchema = new mongoose.Schema({
  prato: { type: mongoose.Schema.Types.ObjectId, ref: 'Prato', required: true },
  preco: { type: Number, required: true, min: 0 },
  tipoVenda: {
    type: String,
    enum: ['kg', 'unidade', 'porcao', 'marmita', 'outro'],
    required: true
  },
  disponivel: { type: Boolean, default: true },
  observacao: { type: String, default: '', trim: true }
});

const cardapioDoDiaSchema = new mongoose.Schema({
  data: { type: Date, required: true, index: true },
  itens: [itemCardapioSchema]
});

module.exports = mongoose.model('CardapioDoDia', cardapioDoDiaSchema);

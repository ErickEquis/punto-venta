const mongoose = require('mongoose');

const venta = mongoose.model('Venta', new mongoose.Schema({
    _id: { type: Number, required: true },
    seq: { type: Number, default: 1 },

    productos: Array,
    total_venta: Number,
    id_usuario: Number,
    timestamp: Date
}));

module.exports = venta
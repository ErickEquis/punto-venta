const mongoose = require('mongoose');

const Venta = mongoose.model('Venta', new mongoose.Schema({
    name: String
}));

module.exports = {
    Venta
}
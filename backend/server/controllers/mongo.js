const { Venta } = require('../models/index.mongo')
const mongoose = require('mongoose');

async function create(req, res) {

    try {

        await mongoose.connect('mongodb://root:example@mongo:27017/')

        const silence = new Venta({ name: req.body.name });

        await silence.save()

        return res.status(200).json({ mensaje: 'Exito' });


    } catch (error) {
        console.log(error);
        return res.status(500)
    }

}

module.exports = {
    create
}
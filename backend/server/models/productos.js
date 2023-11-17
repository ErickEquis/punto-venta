'use strict'

const config = require('../config/config');

const schema = config.plataformas.dvpv;

module.exports = (sequelize, DataTypes) => {
    let ca_producto = sequelize.define('ca_producto', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        precio: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        estatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        timestamps: false,
        charset: 'UTF8',
        schema: schema
    });

    return ca_producto;
};
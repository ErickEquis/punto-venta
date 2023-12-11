'use strict'

const config = require('../config/config');

const schema = config.plataformas.dvpv;

module.exports = (sequelize, DataTypes) => {
    let ca_productos = sequelize.define('ca_productos', {
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
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        cantidad: {
            type: DataTypes.INTEGER,
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

    return ca_productos;
};
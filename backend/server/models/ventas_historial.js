'use strict'

const config = require('../config/config');

module.exports = (sequelize, DataTypes, Deferrable) => {
    const schema = config.plataformas.dbpv.schema;

    let ca_ventas_historial = sequelize.define(
        'ca_ventas_historial',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            id_modificado: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            productos: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            productos_modificados: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            total_venta: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            total_venta_modificado: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            fecha_venta: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            fecha_venta_modificada: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            charset: 'UTF8',
            schema: schema
        }
    );

    return ca_ventas_historial;
};
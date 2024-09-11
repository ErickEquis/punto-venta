'use strict'

const config = require('../config/config');

const ca_usuarios = require('./usuarios')

module.exports = (sequelize, DataTypes, Deferrable) => {
    const schema = config.plataformas.dbpv.schema;

    let ca_historial_ventas = sequelize.define(
        'ca_historial_ventas',
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
            id_usuario_modifica: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: ca_usuarios,
                    key: 'id',
                    deferrable: Deferrable.INITIALLY_IMMEDIATE
                }
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
            fecha_modificacion: {
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

    ca_historial_ventas.associate = (models) => {
        ca_historial_ventas.belongsTo(models.ca_usuarios, {
            through: models.ca_usuarios,
            foreignKey: 'id_usuario_modifica',
        });
    }

    return ca_historial_ventas;
};
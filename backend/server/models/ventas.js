'use strict'

const config = require('../config/config');
const ca_usuarios = require('./usuarios')
const ca_equipos = require('./equipos')
const ca_historial_ventas = require('./historial_ventas')

module.exports = (sequelize, DataTypes, Deferrable) => {
    const schema = config.plataformas.dbpv.schema;

    let ca_ventas = sequelize.define(
        'ca_ventas',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            id_usuario: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: ca_usuarios,
                    key: 'id',
                    deferrable: Deferrable.INITIALLY_IMMEDIATE
                }
            },
            id_equipo: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: ca_equipos,
                    key: 'id',
                    deferrable: Deferrable.INITIALLY_IMMEDIATE
                }
            },
            productos: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            total_venta: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            modificado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            id_modificado: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: ca_historial_ventas,
                    key: 'id',
                    deferrable: Deferrable.INITIALLY_IMMEDIATE
                }
            },
            fecha_venta: {
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

    ca_ventas.associate = (models) => {
        ca_ventas.belongsTo(models.ca_usuarios, {
            as: 'usuario',
            through: models.ca_usuarios,
            foreignKey: 'id_usuario',
        });
        ca_ventas.belongsTo(models.ca_historial_ventas, {
            through: models.ca_historial_ventas,
            foreignKey: 'id_modificado',
        });
        ca_ventas.belongsTo(models.ca_equipos, {
            through: models.ca_equipos,
            foreignKey: 'id_equipo',
        });
    };

    return ca_ventas;
};
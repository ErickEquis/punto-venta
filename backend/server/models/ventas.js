'use strict'

const config = require('../config/config');
const ca_usuarios = require('./usuarios')
const ca_ventas_historial = require('./ventas_historial')

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
                    model: ca_ventas_historial,
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
            through: models.ca_usuarios,
            foreignKey: 'id_usuario',
        });
    };

    ca_ventas.associate = (models) => {
        ca_ventas.belongsTo(models.ca_ventas_historial, {
            through: models.ca_ventas_historial,
            foreignKey: 'id_modificado',
        });
    };

    return ca_ventas;
};
'use strict'

const config = require('../config/config');
const ca_equipos = require('./equipos')
const ca_categoria_notificaciones = require('./categoria_notificaciones')

module.exports = (sequelize, DataTypes, Deferrable) => {
    const schema = config.plataformas.dbpv.schema;

    let ca_notificaciones = sequelize.define(
        'ca_notificaciones',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
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
            id_categoria: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: ca_categoria_notificaciones,
                    key: 'id',
                    deferrable: Deferrable.INITIALLY_IMMEDIATE
                }
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            data: {
                type: DataTypes.JSONB,
                allowNull: false,
            },
            estatus: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            timestamps: false,
            charset: 'UTF8',
            schema: schema
        }
    );

    ca_notificaciones.associate = (models) => {
        ca_notificaciones.belongsTo(models.ca_equipos, {
            through: models.ca_equipos,
            foreignKey: 'id_equipo',
        });
        ca_notificaciones.belongsTo(models.ca_categoria_notificaciones, {
            through: models.ca_categoria_notificaciones,
            foreignKey: 'id_categoria',
            as: 'categoria'
        });
    };

    return ca_notificaciones;
};
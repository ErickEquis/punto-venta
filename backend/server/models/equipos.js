'use strict'

const config = require('../config/config');

module.exports = (sequelize, DataTypes, Deferrable) => {
    const schema = config.plataformas.dbpv.schema;

    let ca_equipos = sequelize.define(
        'ca_equipos',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                unique: true
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            integrantes: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            charset: 'UTF8',
            schema: schema
        }
    );

    return ca_equipos;
};
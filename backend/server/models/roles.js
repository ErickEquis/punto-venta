'use strict'

const config = require('../config/config.json');

module.exports = (sequelize, DataTypes) => {
    const schema = config.plataformas.dbpv.schema;

    let ca_roles = sequelize.define(
        'ca_roles',
        {
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
            is_admin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            permisos: {
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

return ca_roles;
};
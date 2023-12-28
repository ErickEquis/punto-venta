'use strict'

const config = require('../config/config');
const ca_roles = require('./roles')

module.exports = (sequelize, DataTypes, Deferrable) => {
    const schema = config.plataformas.dbpv.schema;

    let ca_usuarios = sequelize.define(
        'ca_usuarios',
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            id_rol: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: ca_roles,
                    key: 'id',
                    deferrable: Deferrable.INITIALLY_IMMEDIATE
                }
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            contrasenia: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            correo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            ultimo_acceso: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            equipo: {
                type: DataTypes.INTEGER,
                allowNull: true,
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

    ca_usuarios.associate = (models) => {
        ca_usuarios.belongsTo(models.ca_roles, {
            through: models.ca_roles,
            foreignKey: 'id_rol',
        });
    };

    return ca_usuarios;
};
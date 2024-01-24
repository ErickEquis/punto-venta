'use strict'

const config = require('../config/config');

const ca_usuarios = require('./usuarios')

const schema = config.plataformas.dvpv;

module.exports = (sequelize, DataTypes, Deferrable) => {
    let ca_productos = sequelize.define('ca_productos', {
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
        codigo: {
            type: DataTypes.STRING,
            allowNull: true,
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

    ca_productos.associate = (models) => {
        ca_productos.belongsTo(models.ca_usuarios, {
            through: models.ca_usuarios,
            foreignKey: 'id_usuario',
        });
    };

    return ca_productos;
};
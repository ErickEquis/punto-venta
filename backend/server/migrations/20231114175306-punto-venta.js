'use strict';

const config = require('../config/config') 
const schema = config.plataformas.dvpv

module.exports = {
  up: async function (queryInterface, DataTypes) {
    
    await queryInterface.bulkDelete({
      tableName: 'SequelizeMeta',
      where: {},
      options: { truncate: true },
    });

    await queryInterface.createTable('ca_productos', {
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
        }
      },
      {
        charset: 'UTF8',
        schema: schema
      });

    await queryInterface.createTable('ca_roles', {
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
        charset: 'UTF8',
        schema: schema
      });

    await queryInterface.createTable('ca_usuarios', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_rol: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: {
            schema: schema,
            tableName: 'ca_roles',
          },
          key: 'id',
        },
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
        charset: 'UTF8',
        schema: schema
      });



  },

  async down(queryInterface, Sequelize) {}
};
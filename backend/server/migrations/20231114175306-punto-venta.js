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

    await queryInterface.createTable('ca_producto', {
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
        type: DataTypes.STRING,
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
  },

  async down(queryInterface, Sequelize) {}
};
'use strict';

const config = require('../config/config')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const schema = config.plataformas.dbpv.schema;

    // Update de slug
    // let array_ids = [0, 10, 11]
    // for (let i = 0; i < array_ids.length; i++) {
    //   await queryInterface.bulkUpdate({ tableName: 'ca_roles', schema: schema },
    //     { permisos: '{"equipo": {"icon": "groups", "slug": "/point/user/equipo"}, "ventas": {"icon": "payments", "slug": "/point/user/ventas"}, "notificaciones": {"icon": "notifications", "slug": "/point/user/notificaciones"}}' }, { id: array_ids[i] }
    //   )
    // }

    // Cambio de nombre de columna y de atributos
    await queryInterface.renameColumn({ tableName: 'ca_ventas', schema: schema }, 'productos', 'id_productos_mdb')
    await queryInterface.changeColumn({ tableName: 'ca_ventas', schema: schema }, 'id_productos_mdb', {
      type: 'BIGINT USING CAST("id_productos_mdb" as STRING)',
      allowNull: false,
    })

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};

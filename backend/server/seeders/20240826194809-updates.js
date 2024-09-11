'use strict';

const config = require('../config/config')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const schema = config.plataformas.dbpv.schema;

    // Update de slug
    let array_ids = [0, 10, 11]
    for (let i = 0; i < array_ids.length; i++) {
      await queryInterface.bulkUpdate({ tableName: 'ca_roles', schema: schema },
        { permisos: '{"equipo": {"icon": "groups", "slug": "/point/user/equipo"}, "ventas": {"icon": "payments", "slug": "/point/user/ventas"}, "notificaciones": {"icon": "notifications", "slug": "/point/user/notificaciones"}}' }, { id: array_ids[i] }
      )
    }

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

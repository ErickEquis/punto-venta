'use strict';

const config = require('../config/config')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const schema = config.plataformas.dbpv.schema;
    await queryInterface.bulkDelete({ tableName: 'SequelizeMeta', where: {}, options: { truncate: true } });

    await queryInterface.bulkInsert({ tableName: 'ca_roles', schema: schema }, [
      { id: 0, descripcion: "Root", is_admin: true, estatus: true },
      { id: 10, descripcion: "Administrador", is_admin: true, estatus: true },
      { id: 11, descripcion: "Empleado", is_admin: false, estatus: true },
      { id: 9, descripcion: "Visitante", is_admin: false, estatus: false },
    ], {});
  },

  async down(queryInterface, Sequelize) { }
};

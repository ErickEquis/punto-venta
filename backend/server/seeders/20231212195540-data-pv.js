'use strict';

const config = require('../config/config')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const schema = config.plataformas.dbpv.schema;
    await queryInterface.bulkDelete({ tableName: 'SequelizeMeta', where: {}, options: { truncate: true } });

    await queryInterface.bulkInsert({ tableName: 'ca_roles', schema: schema }, [
      { id: 0, descripcion: "Root", is_admin: true, permisos: '{"inventario": {"estatus": true, "slug": "/point/inventario"}, "equipo": {"estatus": true, "slug": "/user/home"}}', estatus: true },
      { id: 10, descripcion: "Administrador", is_admin: true, permisos: '{"inventario": {"estatus": true, "slug": "/point/inventario"}, "equipo": {"estatus": true, "slug": "/user/home"}}', estatus: true },
      { id: 11, descripcion: "Empleado", is_admin: false, permisos: '{"inventario": {"estatus": true, "slug": "/point/inventario"}, "equipo": {"estatus": false, "slug": "/user/home"}}', estatus: true },
    ], {});

    await queryInterface.bulkInsert({ tableName: 'ca_usuarios', schema: schema }, [
      { id:1, id_rol: 0, nombre: "root", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "root@correo.com", equipo: -1, estatus: true },
      { id:2, id_rol: 10, nombre: "Terry", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "terry@correo.com", equipo: null, estatus: true },
      { id:3, id_rol: 11, nombre: "Gorda", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "gorda@correo.com", equipo: 2, estatus: true },
      { id:4, id_rol: 10, nombre: "Erick", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "erick@correo.com", equipo: null, estatus: true },
      { id:5, id_rol: 11, nombre: "Jonas", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "jonas@correo.com", equipo: 4, estatus: true },
    ], {});

  },

  async down(queryInterface, Sequelize) { }
};

'use strict';

const config = require('../config/config')

module.exports = {
  up: async function (queryInterface, Sequelize) {
    const schema = config.plataformas.dbpv.schema;
    await queryInterface.bulkDelete({ tableName: 'SequelizeMeta', where: {}, options: { truncate: true } });

    await queryInterface.bulkInsert({ tableName: 'ca_roles', schema: schema }, [
      { id: 0, descripcion: "Root", is_admin: true, permisos: '{"inventario": {"estatus": true, "slug": "/point/inventario"}, "equipo": {"estatus": true, "slug": "/user/home"}}', estatus: true },
      { id: 10, descripcion: "Administrador", is_admin: true, permisos: '{"equipo": {"body": "x", "slug": "/user/equipo"}, "ventas": {"body": "x", "slug": "/user/ventas"}}', estatus: true },
      { id: 11, descripcion: "Empleado", is_admin: false, permisos: '{"equipo": {"body": "x", "slug": "/user/equipo"}, "ventas": {"body": "x", "slug": "/user/ventas"}}', estatus: true },
    ], {});

    await queryInterface.bulkInsert({ tableName: 'ca_equipos', schema: schema }, [
      { id: -1, nombre: "Admin" },
      { id: 1, nombre: "Dittos", integrantes: '{"id": [2, 3]}' },
      { id: 2, nombre: "Chimuelos", integrantes: '{"id": [4, 5]}' },
    ], {});

    await queryInterface.bulkInsert({ tableName: 'ca_usuarios', schema: schema }, [
      { id: 1, id_rol: 0, id_equipo: -1, nombre: "root", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "root@correo.com", estatus: true },
      { id: 2, id_rol: 10, id_equipo: 1, nombre: "Terry", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "terry@correo.com", estatus: true },
      { id: 3, id_rol: 11, id_equipo: 1, nombre: "Gorda", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "gorda@correo.com", estatus: true },
      { id: 4, id_rol: 10, id_equipo: 2, nombre: "Erick", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "erick@correo.com", estatus: true },
      { id: 5, id_rol: 11, id_equipo: 2, nombre: "Jonas", contrasenia: "de88e3e4ab202d87754078cbb2df6063", correo: "jonas@correo.com", estatus: true },
    ], {});

    await queryInterface.bulkInsert({ tableName: 'ca_productos', schema: schema }, [
      { id: 1, id_equipo: 1, descripcion: "croqueta", precio: 10, cantidad: 25, codigo: null, estatus: true },
      { id: 2, id_equipo: 1, descripcion: "crema", precio: 25, cantidad: 25, codigo: null, estatus: true },
      { id: 3, id_equipo: 1, descripcion: "gel", precio: 12, cantidad: 25, codigo: null, estatus: true },
      { id: 4, id_equipo: 1, descripcion: "agua", precio: 5, cantidad: 25, codigo: null, estatus: true },
      { id: 5, id_equipo: 1, descripcion: "dulce", precio: .50, cantidad: 25, codigo: null, estatus: true },
      { id: 6, id_equipo: 2, descripcion: "croqueta", precio: 11.20, cantidad: 25, codigo: null, estatus: true },
      { id: 7, id_equipo: 2, descripcion: "crema", precio: 20, cantidad: 25, codigo: null, estatus: true },
      { id: 8, id_equipo: 2, descripcion: "gel", precio: 10, cantidad: 25, codigo: null, estatus: true },
      { id: 9, id_equipo: 2, descripcion: "agua", precio: 12, cantidad: 25, codigo: null, estatus: true },
      { id: 10, id_equipo: 2, descripcion: "dulce", precio: 1, cantidad: 25, codigo: null, estatus: true }
    ], {});

  },

  async down(queryInterface, Sequelize) { }
};

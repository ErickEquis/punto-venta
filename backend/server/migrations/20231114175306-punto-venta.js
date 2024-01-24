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

    await queryInterface.createTable('ca_productos', {
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
            model: {
              schema: schema,
              tableName: 'ca_usuarios',
            },
            key: 'id',
          },
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
        }
      },
        {
          charset: 'UTF8',
          schema: schema
        });

    await queryInterface.createTable('ca_ventas_historial', {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_modificado: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      productos: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      productos_modificados: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      total_venta: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total_venta_modificado: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      fecha_venta: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fecha_venta_modificada: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
      {
        charset: 'UTF8',
        schema: schema
      });

    await queryInterface.createTable('ca_ventas', {
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
          model: {
            schema: schema,
            tableName: 'ca_usuarios',
          },
          key: 'id',
        },
      },
      productos: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      total_venta: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      modificado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      id_modificado: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: {
            schema: schema,
            tableName: "ca_ventas_historial",
          },
          key: 'id',
        }
      },
      fecha_venta: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
      {
        charset: 'UTF8',
        schema: schema
      });

  },

  async down(queryInterface, Sequelize) {}
};
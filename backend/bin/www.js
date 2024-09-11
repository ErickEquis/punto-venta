const app = require('../app');

const path = require('path');
const basename = path.basename(__filename);
const { connectToDatabase } = require('../server/models/nosql/index')

const cron = require('node-cron');
const fs = require('fs');
const { deleteProductos } = require('../server/controllers/productos');
const { notificacionesInventario } = require('../server/controllers/notificaciones');

fs
    .readdirSync('./server/routes')
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    })
    .forEach((file) => {
        file.replace('.js', '')
        require(`../server/routes/${file}`)(app);
    })

connectToDatabase();

cron.schedule('0 1 * * *', async () => {
    try {

        await notificacionesInventario()

        await deleteProductos()

    } catch (error) {
        console.error(error)
    }

});
const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://mongo/', {
            user: "root",
            pass: "example",
            dbName: "dbpv",
        });
        console.log('Successfully connected to database');
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    connectToDatabase,
};
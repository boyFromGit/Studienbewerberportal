const mongoose = require('mongoose');
const config = require('config');
const UserService = require('../endpoints/user/UserService');

let _db;

const connectionString = config.get('db.connectionString');

// initialize database connection
async function initDB() {
    try {
        if (_db) {
            return _db;
        }
        else {

            await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
            _db = mongoose.connection;

            console.log("Connected to database " + connectionString + " in db.js: " + _db);
            return _db
        }
    }
    catch (error) {
        console.error("Error: " + error);
        throw error;
    }
}

// connect to database via initDB()
async function connect() {
    try {
        db = await initDB();

        if (db) {
            console.log("Anbindung zur Datenbank erfolgreich")
            await UserService.createDefaultAdmin();
        }
        else {
            console.log("Anbindung zur Datenbank gescheitert.")
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    connect
}
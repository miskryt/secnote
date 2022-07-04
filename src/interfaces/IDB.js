"use strict"
const DBConnect = require('../db/PostgresDBConnect');
const Database = require('../db/Database');


class IDB {
    db = false;

    constructor() {
        this.db = new Database(new DBConnect());
    }

    Save(text){
        return this.db.Save();
    }

    Find(){

    }
}

module.exports = IDB;
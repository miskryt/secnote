"use strict"


class Database {
    conn = false;

    constructor(conn) {
        this.conn = conn;
    }

    Save(text){
        return this.conn.Save();
    }

    Find(){

    }

    Close(){
        this.conn.Close()
    }
}

module.exports = Database;
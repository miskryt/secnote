"use strict"
const client = require('mysql2');
const dotenv = require("dotenv")

dotenv.config()

class MysqlDBConnect{

    constructor() {
        this.client = client.createConnection({
            user: process.env.MYSQLDB_USER,
            host: process.env.MYSQLDB_HOST,
            database: process.env.MYSQLDB_DATABASE,
            password: process.env.MYSQLDB_ROOT_PASSWORD,
        }).promise();

    }



    /* Public interface */
    Save(params){
        const sql = "insert into...";
    }

    FindByHash(hash){
        const sql = "select * from table...";
    }

    async query(query) {

        return await this.client.query(query)
    }


    async end(){
        await this.client.end();
    }
}

module.exports = MysqlDBConnect;
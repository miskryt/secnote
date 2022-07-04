"use strict"
const {Client} = require('pg');


class PostgresDBConnect{

     constructor() {
         this.connection = new Client({
            user: process.env.PG_USER,
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            password: process.env.PG_PASS,
        })

        this.connect();
    }

    async connect(){
        try {
            await this.connection.connect();
            console.log("connected to database");
        } catch (err) {
            console.log("Not connected to DB" + err);
        }
    };

    Save(params){

    }

    Close(){
        this.connection.end();
    }
}

module.exports = PostgresDBConnect;
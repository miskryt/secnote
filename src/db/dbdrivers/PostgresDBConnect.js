"use strict"
const {Client} = require('pg');
const dotenv = require("dotenv")

dotenv.config()

class PostgresDBConnect{

     constructor() {
         this.client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASS,
        })

        this.connect();
    }


    /**
    * @type {Promise<Client>}
    * */
     async SaveNote(text, hash){
        const sql = `INSERT INTO notes_table(text, hash) VALUES('${text}', '${hash}') RETURNING *`;

        try
        {
            return await this.query(sql);
        }
        catch (err)
        {
            console.log(err.stack);
            return false;
        }
    }

    /**
     * @type {Promise<Client>}
     * */
    async FindByHash(hash)
    {
        const sql = `SELECT text FROM notes_table WHERE hash='${hash}'`;

        try
        {
            return await this.query(sql);
        }
        catch (err)
        {
            console.log(err.stack);
            return false;
        }
    }

    async DeleteByHash(hash)
    {
        const sql = `DELETE FROM notes_table WHERE hash='${hash}'`;

        try
        {
            return await this.query(sql);
        }
        catch (err)
        {
            console.log(err.stack);
            return false;
        }
    }

    /**
     *
     * @param query
     * @returns {Promise<Client>}
     */
    async query(query)
    {
         return await this.client.query(query);
    }
    /* Public interface */

    async connect()
    {
        try
        {
            await this.client.connect();
            console.log("connected to database");
        }
        catch (err)
        {
            console.log("Not connected to DB" + err);
        }
    };

    async end(){
        await this.client.end();
    }
}

module.exports = PostgresDBConnect;
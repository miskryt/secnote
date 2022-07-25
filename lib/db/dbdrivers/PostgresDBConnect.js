"use strict"
const {Client} = require('pg');

class PostgresDBConnect{

     constructor(settings)
     {
         this._client = new Client(settings);
         this.connect().then(r => {
             console.log("connected to database");
         });
     }


    async save(sql)
    {
        const res = await this._client.query(sql);

        return {
            rows: res.rowCount,
            result: ''
        }
    }

    async read(sql)
    {
        const res = await this._client.query(sql);

        if(res.rowCount > 0)
        {
            return {
                rows: 1,
                result: res.rows[0].text ?? ''
            }
        }
        else
        {
            return {
                rows: 0,
                result: ''
            }
        }
    }
    /* Public interface */

    async connect()
    {
        try
        {
            return await this._client.connect();
        }
        catch (err)
        {
            console.log("Not connected to DB" + err);
        }
    };

    /**
     *
     * @param query
     * @returns {Promise<Client>}
     */
    async query(query)
    {
        return await this._client.query(query);
    }

    async end(){
        await this._client.end();
    }
}

module.exports = PostgresDBConnect;
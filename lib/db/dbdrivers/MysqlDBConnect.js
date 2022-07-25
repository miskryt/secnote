"use strict"
const mysql = require('mysql2');

class MysqlDBConnect{

    constructor(settings)
    {
        const pool = mysql.createPool(settings);
        this._client = pool.promise();
    }

    /**
     *
     * @param query
     * @returns {Promise<Client>}
     */
    async save(sql)
    {
        const res = await this._client.query(sql);

        return {
            rows: res[0].affectedRows,
            result: ''
        }
    }

    async read(sql)
    {
        const res = await this._client.query(sql);

        if(res[0].affectedRows > 0)
        {
            return {
                rows: 1,
                result: res[0][0].text ?? ''
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

    /**
     *
     * @param query
     * @returns {Promise<Client>}
     */
    async query(query)
    {
        const res = await this._client.query(query);

        return res[0].affectedRows;
    }

    async end()
    {
        await this._client.end();
    }
}

module.exports = MysqlDBConnect;
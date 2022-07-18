"use strict"

const DBConnect = require('../../db/dbdrivers/PostgresDBConnect');
//const DBConnect = require('../../db/dbdrivers/MysqlDBConnect');

/**
 *
 * @type {IDB}
 */
class IDB {
    conn = false;

    constructor() {
        this.conn = new DBConnect();
    }

    async FindByHash(hash)
    {
        const res = await this.conn.FindByHash(hash);
        return res.rows[0] ?? false;
    }

    async DeleteByHash(hash)
    {
        const res = await this.conn.DeleteByHash(hash);
        return res.rows[0] ?? false;
    }

    /**
     * @type {boolean}
     * */
    async SaveNote(text, hash)
    {
        const res = await this.conn.SaveNote(text, hash);
        return res.rowCount !== undefined && res.rowCount > 0;
    }


    async query(query, params= false)
    {
        return await this.conn.query(query, params);
    }

    async connect()
    {
        return await this.conn.connect();
    }

    async end()
    {
        return await this.conn.end();
    }
}

module.exports = IDB;
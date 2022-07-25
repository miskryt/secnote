"use strict"

const dotenv = require("dotenv")

dotenv.config()

/**
 *
 * @type {IDB}
 */
class IDB
{
    _conn = false;

    constructor()
    {
        if(process.env.DATABASE_DRIVER === 'postgres')
        {
            const settings = {
                user: process.env.PGUSER,
                host: process.env.PGHOST,
                database: process.env.PGDATABASE,
                password: process.env.PGPASS,
            };

            const connect = require('../../db/dbdrivers/PostgresDBConnect');
            this._conn = new connect(settings);
        }

        if(process.env.DATABASE_DRIVER === 'mysql')
        {
            const settings = {
                user: process.env.MYSQLDB_USER,
                host: process.env.MYSQLDB_HOST,
                database: process.env.MYSQLDB_DATABASE,
                password: process.env.MYSQLDB_ROOT_PASSWORD,
            };

            const connect = require('../../db/dbdrivers/MysqlDBConnect');
            this._conn = new connect(settings);
        }
    }

    async FindByHash(hash)
    {
        const sql = `SELECT text FROM notes_table WHERE hash='${hash}'`;

        try
        {
            const res = await this._conn.read(sql);
            return res.result;
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
            const res = await this._conn.query(sql);
            return res > 0 ?? false;
        }
        catch (err)
        {
            console.log(err.stack);
            return false;
        }
    }

    /**
     * @type {boolean}
     * */
    async SaveNote(text, hash)
    {
        const sql = `INSERT INTO notes_table(text, hash) VALUES('${text}', '${hash}')`;

        try
        {
            const res = await this._conn.save(sql);
            return res.rows > 0;
        }
        catch (err)
        {
            console.log(err.stack);
            return false;
        }
    }

    async query(sql)
    {
        return this._conn.query(sql);
    }

    async end()
    {
        return this._conn.end();
    }
}

module.exports = IDB;
const IDB = require('../../interfaces/database/IDB');

class Migration{
    constructor()
    {
        this._db = new IDB();
    }

    async CreateTable()
    {
        const sql = 'CREATE TABLE notes_table (id SERIAL PRIMARY KEY, text TEXT NOT NULL, hash VARCHAR(128) NOT NULL)';
        const res = await this._db.query(sql);
    }

    async DropTable()
    {
        const sql = 'DROP TABLE notes_table';

        try
        {
            const res = await this._db.query(sql);
        }
        catch (e)
        {
            console.log(e.sqlMessage)
        }
    }

    async Close()
    {
        await this._db.end();
    }

    async Migrate()
    {
        await this.DropTable();
        await this.CreateTable();
        await this.Close();
    }
}


new Migration().Migrate();

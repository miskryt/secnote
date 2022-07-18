const IDB = require('../../interfaces/database/IDB');

class Migration{
    constructor() {
        this.db = new IDB();
    }

    async CreateTable()
    {
        const sql = 'CREATE TABLE notes_table (id SERIAL PRIMARY KEY, text TEXT NOT NULL, hash VARCHAR(128) NOT NULL)';
        const res = await this.db.query(sql);
    }

    async DropTable()
    {
        const sql = 'DROP TABLE notes_table';
        const res = await this.db.query(sql);
    }

    async Close()
    {
        await this.db.end();
    }

    async Migrate()
    {
        await this.DropTable();
        await this.CreateTable();
        await this.Close();
    }
}


new Migration().Migrate();

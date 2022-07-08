const IDB = require('../../interfaces/database/IDB');

class Migration{
    constructor() {
        this.db = new IDB();
    }

    async DropDatabase()
    {
        try
        {
            const res = await this.db.query('DROP DATABASE notes_db');
            console.log(res);
            return true;
        }
        catch (error)
        {
            //console.error(error.stack);
            return true;
        }
    };

    async CreateDatabase()
    {
        try
        {
            const res = await this.db.query('CREATE DATABASE notes_db');
            console.log(res);
            return true;
        }
        catch (error)
        {
            console.error(error.stack);
            return false;
        }
    };

    async CreateTable()
    {
        const sql = 'CREATE TABLE notes_table (id SERIAL PRIMARY KEY, text TEXT NOT NULL, hash VARCHAR(128) NOT NULL)';
        console.log(sql)
        const res = await this.db.query(sql);
    }

    async Close()
    {
        await this.db.end();
    }

    async Migrate()
    {
        //await this.DropDatabase();
        //await this.CreateDatabase();
        await this.CreateTable();

        await this.Close();
    }
}


new Migration().Migrate();


//

//migrate.CreateTable();
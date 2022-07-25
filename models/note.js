"use strict"

const IDB = require('../lib/interfaces/database/IDB');
const ICrypt = require('../lib/interfaces/crypto/ICrypt');

class Note
{
    constructor()
    {
        this.crypt = new ICrypt();
        this.db = new IDB();
    }

    setText(text)
    {
        this.text = text;
        return this;
    }

    getUrl()
    {
        return this.url;
    }

    encrypt()
    {
        this.encrypted = this.crypt.CipherText(this.text, this.crypt.GenerateRandomSecret());
        return this;
    }

    async save()
    {
        const hash = this.crypt.MakeHashFromEncrypted(this.encrypted);
        const secret = this.crypt.GenerateRandomSecret();
        this.url =  [hash, secret].join('/');

        const res = await this.db.SaveNote(
            this.encrypted,
            hash
        );

        if(res)
        {
            return true
        }

        return false;
    }

    async read(hash, secret)
    {
        const encrypted = await this.db.FindByHash(hash);

        if(encrypted != false)
        {
            const text = this.crypt.DecipherText(encrypted.text, secret);
            return text;
        }

        return false;
    }

    async delete(hash)
    {
        await this.db.DeleteByHash(hash);
    }
}

module.exports = Note;
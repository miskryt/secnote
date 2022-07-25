"use strict"

const DB = require('../lib/interfaces/database/IDB');
const ICrypt = require('../lib/interfaces/crypto/ICrypt');

class Note
{
    _crypt;
    _db;

    constructor()
    {
        this._crypt = new ICrypt();
        this._db = new DB();
    }

     setText(text)
    {
        this._text = text;
        return this;
    }

    /**
     * @readonly
     * @returns {string}
     * @memberof Note
     */
    url()
    {
        return this._url;
    }

    encrypt()
    {
        this._secret = this._crypt.GenerateRandomSecret();
        this._encrypted = this._crypt.CipherText(this._text, this._secret);

        return this;
    }

    async save()
    {
        if(this._encrypted === undefined || this._encrypted.length === 0)
            return false;

        if(this._text === undefined || this._text.length === 0)
            return false;

        const hash = this._crypt.MakeHashFromEncrypted(this._encrypted);
        this._url =  [hash, this._secret].join('/');

        const res = await this._db.SaveNote(
            this._encrypted,
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
        const encrypted = await this._db.FindByHash(hash);

        if(encrypted != false)
        {
            const text = this._crypt.DecipherText(encrypted, secret);
            return text;
        }

        return false;
    }

    async delete(hash)
    {
        await this._db.DeleteByHash(hash);
    }
}

module.exports = Note;
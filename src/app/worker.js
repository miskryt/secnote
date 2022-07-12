"use strict"

const IDB = require('../interfaces/database/IDB');
const ICrypt = require('../interfaces/crypto/ICrypt');

class Worker{

    hash = false;

    constructor() {
        this.crypt = new ICrypt();
        this.db = new IDB();
    }



    /**
     * @type {string}
     */
    async MakeNote(text)
    {
        const secret = this.crypt.GenerateRandomSecret();

        const encrypted =  this.crypt.CipherText(text, secret);

        const hash = this.crypt.MakeHashFromEncrypted(encrypted);

        const res = await this.db.SaveNote(encrypted, hash);

        if(res)
        {
            this.url = this.makeUrl(hash, secret);
        }

        return (this.url);
    }

    /**
     *
     * @returns {string} url
     */
    makeUrl(hash, secret)
    {
        return [hash, secret].join('/');
    }

    /**
     * url for saved note
     * @type {array}
     */
    async ReadNote(hash, secret)
    {
        const encrypted = await this.db.FindByHash(hash);

        if(encrypted != false)
        {
            const text = this.crypt.DecipherText(encrypted.text, secret);
            return text;
        }

        return false;
    }
}

module.exports = Worker;
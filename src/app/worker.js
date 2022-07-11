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

        const encrypted = this.crypt.CipherText(text);

        const hash = this.crypt.MakeHashFromEncrypted(encrypted);

        const res = await this.db.SaveNote(encrypted, hash);

        if(res)
        {
            this.url = this.makeUrl(secret, hash);
        }

        return (this.url);
    }

    /**
     *
     * @returns {string} url
     */
    makeUrl(secret, hash)
    {
        const url = [hash, secret].join('#');
        return url;
    }

    /**
     * url for saved note
     * @type {string}
     */
    ReadNote(url) {
        const {hash, key} = String.split('#');
        const result = this.db.FindByHash(hash);
        this.crypt.DecipherText(result, key);
    }
}

module.exports = Worker;
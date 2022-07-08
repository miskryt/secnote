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
    makeHash()
    {
        const hash = 'hash'
        return hash;
    }

    /**
     * @type {string}
     */
    makeSecret()
    {
        this.hash = ''
        return this.hash;
    }

    getNoteUrl(){
        return this.hash + "url";
    }

    /**
     * @type {string}
     */
    async MakeNote(text)
    {
        const encrypted = this.crypt.CipherText(text);
        const secret = this.makeSecret();
        const hash = this.makeHash();

        const res = await this.db.SaveNote(encrypted, hash);

        return (res);
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
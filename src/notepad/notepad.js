"use strict"

const IDB = require('../interfaces/IDB');
const ICrypt = require('../interfaces/ICrypt');

class Notepad {

    constructor() {
        this.crypt = new ICrypt();
        this.db = new IDB();
    }

    /**
     * Pure note text
     * @type {string}
     */
    MakeNote(text)
    {
        const hash = this.db.Save(this.crypt.CipherText(text));
        return this.getNoteUrl(hash);
    }

    /**
     * url for saved note
     * @type {string}
     */
    ReadNote(url) {
        const {hash, key} = String.split('#');
        const result = this.db.Find(hash);
        this.crypt.DecipherText(result, key);
    }
}

module.exports = Notepad;
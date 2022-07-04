"use strict"

const IDB = require('../interfaces/IDB');
const ICrypt = require('../interfaces/ICrypt');

class Worker{

    constructor() {
        this.db = new IDB();
        this.crypt = new ICrypt();
    }

    getNoteUrl(hash){
        return "###";
    }

    CreateNote(text){
        const hash = this.db.Save(this.crypt.CipherText(text));
        return this.getNoteUrl(hash);
    }

    ReadNote(url) {
        const {hash, key} = String.split('#');
        const result = this.db.Find(hash);
        this.crypt.DecipherText(result, key);
    }
}

module.exports = Worker;
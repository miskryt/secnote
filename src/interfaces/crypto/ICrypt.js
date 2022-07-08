"use strict"
const crypto = require('crypto');

class ICrypt{

    constructor() {

    }

    CipherText(text)
    {
        const resizedIV = Buffer.allocUnsafe(16);
        const iv = crypto.createHash('sha256').update('myHashedIV').digest();

        iv.copy(resizedIV);
        const key = crypto.createHash('sha256').update('key').digest();
        const cipher = crypto.createCipheriv('aes256', key, resizedIV);

        let msg = [];
        msg.push(cipher.update('TEST TEST', 'binary', 'hex'));
        msg.push(cipher.final('hex'));
        msg = msg.join('');

        console.log(msg);

        let msg2 = [];
        const key2 = crypto.createHash('sha256').update('key').digest();
        const decipher = crypto.createDecipheriv('aes256', key, resizedIV);

        msg2.push(decipher.update(msg, 'hex', 'binary'));
        msg2.push(decipher.final('binary'))
        msg2 = msg2.join('')

        console.log(msg2);

        return "Test test"
    }

    DecipherText(result, key){

    }

}

module.exports = ICrypt;
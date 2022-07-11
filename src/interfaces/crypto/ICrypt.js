"use strict"
const crypto = require('crypto');

class ICrypt{

    constructor() {

    }

    /**
     * @type {string}
     */
    GenerateRandomSecret()
    {
        return crypto.randomBytes(14).toString('hex');
    }

    /**
     * @type {string}
     */
    MakeHashFromEncrypted(encrypted)
    {
        return crypto.createHash('md5').update(encrypted).digest('hex');
    }

    CipherText(text, secret)
    {
        const resizedIV = Buffer.allocUnsafe(16);
        const iv = crypto.createHash('sha256').update('myHashedIV').digest();

        iv.copy(resizedIV);
        const key = crypto.createHash('sha256').update('key').digest();
        const cipher = crypto.createCipheriv('aes256', key, resizedIV);

        let msg = [];
        msg.push(cipher.update(text, 'binary', 'hex'));
        msg.push(cipher.final('hex'));
        msg = msg.join('');

        return msg;
    }

    DecipherText(secret)
    {
        let msg = [];
        const key = crypto.createHash('sha256').update('key').digest();
        const decipher = crypto.createDecipheriv('aes256', key, resizedIV);

        msg.push(decipher.update(msg, 'hex', 'binary'));
        msg.push(decipher.final('binary'))
        msg = msg.join('')

        return msg;
    }

}

module.exports = ICrypt;
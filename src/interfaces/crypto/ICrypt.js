"use strict"
const crypto = require('crypto');
const util = require('util');

class ICrypt{

    salt = "veryhardsalt";
    alg = 'aes-192-cbc';

    scrypt = util.promisify(crypto.scrypt);
    randomFill = util.promisify(crypto.randomFill);
    createCipheriv = util.promisify(crypto.createCipheriv);

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

    /*
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
    */

    CipherText(text, secret)
    {
        const key = crypto.scryptSync(secret, this.salt, 24);
        const iv = Buffer.alloc(16, 0); // Initialization vector.

        const cipher = crypto.createCipheriv(this.alg, key, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        return (encrypted);
    }

    /*
    DecipherText(secret)
    {
        const resizedIV = Buffer.allocUnsafe(16);
        let msg = [];
        const key = crypto.createHash('sha256').update('key').digest();
        const decipher = crypto.createDecipheriv('aes256', key, resizedIV);

        msg.push(decipher.update(msg, 'hex', 'binary'));
        msg.push(decipher.final('binary'))
        msg = msg.join('')

        return msg;
    }*/

    DecipherText(encrypted, secret)
    {
        const key = crypto.scryptSync(secret, this.salt, 24);
        const iv = Buffer.alloc(16, 0);

        const decipher = crypto.createDecipheriv(this.alg, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');

        decrypted += decipher.final('utf8');

        return(decrypted);
    }

}

module.exports = ICrypt;
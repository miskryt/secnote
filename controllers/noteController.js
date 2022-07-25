"use strict"

const Note = require("../models/note.js");

class NoteController
{
    /***
     *
     * @type {string}
     * @private
     */
    static _appname;

    constructor()
    {
        NoteController._appname = 'Secnote - stay secure';

        this._note = new Note();
    }

    _getBaseUrl(request)
    {
        return request.protocol + '://' + request.get('host');
    }

    index(request, response)
    {
        const renderOptions = {'appname': NoteController._appname};
        response.render('pages/home.twig', renderOptions);
    }

    async create(request, response)
    {
        const text = request.body.text

        if(await this._note.setText(text).encrypt().save())
        {
            const renderOptions = {
                'appname': NoteController._appname,
                'result' : [this._getBaseUrl(request), this._note.url()].join('/')
            };

            response.render('pages/home.twig', renderOptions);
        }
        else
        {
            const renderOptions = {
                'appname': NoteController._appname,
                'result' : 'There is some error...'
            };

            response.render('pages/home.twig', renderOptions);
        }
    }

    read(request, response)
    {
        const renderOptions = {
            'appname' : NoteController._appname,
            'action' : [this._getBaseUrl(request), request.params.hash, request.params.secret].join('/')
        };

        response.render('pages/decrypt-1.twig', renderOptions);
    }

    async decrypt(request, response)
    {
        let renderOptions = {'appname' : NoteController._appname,};

        const result = await this._note.read(request.params.hash, request.params.secret);

        if(result)
        {
            await this._note.delete(request.params.hash);

            renderOptions.result = result;
            await response.render('pages/decrypt-2.twig', renderOptions);
        }
        else
        {
            renderOptions.result = "This note was not find, sorry...";
            await response.render('pages/deleted.twig', renderOptions);
        }
    }
}

module.exports = NoteController;

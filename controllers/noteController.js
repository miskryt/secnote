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
        this.note = new Note();
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

        const note = new Note();

        if(await note.setText(text).encrypt().save())
        {
            const renderOptions = {
                'appname': NoteController._appname,
                'result' : [this._getBaseUrl(request), note.getUrl()].join('/')
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

        const result = this.note.read(request.params.hash, request.params.secret);

        if(result)
        {
            await this.note.delete(request.params.hash);
            renderOptions.result = result;
            response.render('pages/decrypt-2.twig', renderOptions);
        }
        else
        {
            renderOptions.result = "This note was not find, sorry...";
            response.render('pages/deleted.twig', renderOptions);
        }
    }
}

module.exports = NoteController;

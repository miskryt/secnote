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

    constructor(worker)
    {
        NoteController._appname = 'Secnote - stay secure';
        this._worker = worker;
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

    create(request, response)
    {
        const text = request.body.text

        this._worker.MakeNote(text).then((url) =>
        {
            const result = [this._getBaseUrl(request), url].join('/');

            const renderOptions = {
                'appname': NoteController._appname,
                result
            };

            response.render('pages/home.twig', renderOptions);
        });
    }

    read(request, response)
    {
        const renderOptions = {
            'appname' : NoteController._appname,
            'action' : [this._getBaseUrl(request), request.params.hash, request.params.secret].join('/')
        };

        response.render('pages/decrypt-1.twig', renderOptions);
    }

    decrypt(request, response)
    {
        let renderOptions = {'appname' : NoteController._appname,};

        this._worker.ReadNote(request.params.hash, request.params.secret)
            .then((result) =>
            {
                if(result)
                {
                    this._worker.DeleteNote(request.params.hash);
                    renderOptions.result = result;
                    response.render('pages/decrypt-2.twig', renderOptions);
                }
                else
                {
                    renderOptions.result = "This note was not find, sorry...";
                    response.render('pages/deleted.twig', renderOptions);
                }
            });
    }
}

module.exports = NoteController;

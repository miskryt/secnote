"use strict"
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const http = require('http');
const Worker = require('./lib/app/worker');

const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader);


const worker = new Worker();
const app = express();

const options = {};

http.createServer(options, app).listen(process.env.PORT | 3000);

app.set('view engine', 'twing');
app.set('views', './views')

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const appname = 'Secnote - stay secure';

app.get('/', function(req, res)
{
    const renderOptions = {'appname': appname, 'result':''};

    twing.render('pages/home.twig', renderOptions).then((output) =>
    {
        res.end(output);
    });
});

app.post('/', async (req, res) => {

    const text = req.body.text
    const baseurl = req.protocol + '://' + req.get('host');

    const result = await worker.MakeNote(text);
    const url = [baseurl, result].join('/');

    const renderOptions = {'appname': appname, 'result': url};

    twing.render('pages/home.twig', renderOptions).then((output) => {
        res.end(output);
    });
});

app.get('/:hash/:secret', async (req, res) =>
{
    const baseurl = req.protocol + '://' + req.get('host');

    const action = [baseurl, req.params.hash, req.params.secret].join('/');
    const renderOptions = {'appname': appname, 'action': action, 'baseurl': baseurl};

    twing.render('pages/decrypt-1.twig', renderOptions).then((output) =>
    {
        res.end(output);
    });
});

app.post('/:hash/:secret', async (req, res) =>
{
    const baseurl = req.protocol + '://' + req.get('host');
    const result = await worker.ReadNote(req.params.hash, req.params.secret);

    await worker.DeleteNote(req.params.hash);

    const renderOptions = {'appname': appname, 'baseurl': baseurl, 'result': result};

    twing.render('pages/decrypt-2.twig', renderOptions).then((output) =>
    {
        res.end(output);
    });
});
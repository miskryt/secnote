"use strict"
require('dotenv').config();

const express = require('express');
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader);
const fs = require('fs');
const https = require('https');

const Worker = require('./app/worker');
const worker = new Worker();

const app = express();

const options = {
    /*
    * Используем синхронное чтение, чтобы сертификат точно был загружен до старта сервера
    * */
    key: fs.readFileSync("ssl/key.pem"),
    cert: fs.readFileSync("ssl/cert.pem"),

};

https.createServer(options, app).listen(process.env.PORT | 3000);

app.set('view engine', 'twing');
app.set('views', './views')

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const appname = require('../package.json').name;
const renderOptions = {'appname': appname, 'result':''};

app.get('/', function(req, res) {
    renderOptions.result = '';
    twing.render('pages/home.twig', renderOptions).then((output) => {
        res.end(output);
    });
});

app.post('/', async (req, res) => {

    const text = req.body.text
    const baseurl = req.protocol + '://' + req.get('host');

    const result = await worker.MakeNote(text);
    const url = [baseurl, result].join('/');
    renderOptions.result = url;

    twing.render('pages/home.twig', renderOptions).then((output) => {
        res.end(output);
    });
});

app.get('/:hash/:secret', async (req, res) =>
{
    const baseurl = req.protocol + '://' + req.get('host');
    renderOptions.baseurl = baseurl;

    renderOptions.action = [baseurl, req.params.hash, req.params.secret].join('/');

    twing.render('pages/decrypt-1.twig', renderOptions).then((output) => {
        res.end(output);
    });

});

app.post('/:hash/:secret', async (req, res) =>
{
    const baseurl = req.protocol + '://' + req.get('host');
    renderOptions.baseurl = baseurl;

    const result = await worker.ReadNote(req.params.hash, req.params.secret);
    await worker.DeleteNote(req.params.hash);
    renderOptions.result = result;

    twing.render('pages/decrypt-2.twig', renderOptions).then((output) => {
        res.end(output);
    });
});
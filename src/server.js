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
    twing.render('pages/home.twig', renderOptions).then((output) => {
        res.end(output);
    });
});

app.post('/', async function(req, res) {

    const text = req.body.text
    const baseurl = req.protocol + '://' + req.get('host') + req.originalUrl;;

    const result = await worker.MakeNote(text);
    const url = [baseurl, result].join('');
    renderOptions.result = url;

    twing.render('pages/home.twig', renderOptions).then((output) => {
        res.end(output);
    });
});
"use strict"
require('dotenv').config();

const express = require('express');
const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader);
const fs = require('fs');
const https = require('https');

const Notepad = require('./notepad/notepad');
const notepad = new Notepad();

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
const renderOptions = {'appname': appname};

app.get('/', function(req, res) {
    twing.render('pages/home.twig', renderOptions).then((output) => {
        res.end(output);
    });
});

app.post('/', function(req, res) {

    const text = req.body.text

    const url = notepad.MakeNote(text);

    console.log(url)

    twing.render('pages/home.twig', renderOptions).then((output) => {
        res.end(output);
    });
});
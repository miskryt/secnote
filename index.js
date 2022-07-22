"use strict"
require('dotenv').config();

const express = require('express');
const fs = require('fs');
const http = require('http');
const notesRouter = require('./routes/notes');

const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./views');
let twing = new TwingEnvironment(loader);

const app = express();
const router = express.Router()

const options = {};
http.createServer(options, app).listen(process.env.PORT | 3000);

app.set('view engine', 'twing');
app.set('views', './views')

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', notesRouter);

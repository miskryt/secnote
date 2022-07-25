"use strict"

const express = require('express');
const router = express.Router();

const noteController = require('../controllers/noteController');
const controller = new noteController();

router.get('/', controller.index.bind(controller));
router.post('/', controller.create.bind(controller));

router.get('/:hash/:secret', controller.read.bind(controller));
router.post('/:hash/:secret', controller.decrypt.bind(controller));

module.exports = router;
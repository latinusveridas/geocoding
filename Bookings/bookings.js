// ====================================================== MODULES & VARIABLES ======================================================

//RANDOM STRING
var rdmString = require('randomstring');

//DATE & TIME
var datetime = require('node-datetime');

// BODYPARSE
var bodyParser = require('body-parser')

// ROUTER
var express = require('express');
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// COMPONENTS
var DB = require('../Database/database');

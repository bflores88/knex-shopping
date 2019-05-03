const express = require('express');
const router = express.Router();
const knex = require('../database');

router.route('/');

module.exports = router;
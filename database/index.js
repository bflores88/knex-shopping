const config = require('../knexfile');

//exports database connection
module.exports = require('knex')(config);
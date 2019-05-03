const express = require('express');
const router = express.Router();
const knex = require('../database');

router.route('/').get((req, res) => {
  knex
    .raw('select * from products')
    .then((productObject) => {
      if (productObject.rows.length === 0) {
        throw '{ "message": "No products found!" }';
      }

      res.send(productObject.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const knex = require('../database');

router.route('/:user_id').get((req, res) => {
  knex
    .raw(
      'select purchases.id, products.title, products.description, products.price, purchases.created_at from purchases inner join products on purchases.product_id = products.id where user_id = ?',
      [req.params.user_id],
    )
    .then((purchasesObject) => {
      return res.status(200).send(purchasesObject.rows[0]);
    })
    .catch((err) => {
      throw err;
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const knex = require('../database');

router.route('/:user_id').get((req, res) => {
  knex
    .raw('select * from users where id = ?', [req.params.user_id])
    .then((userObject) => {
      if (userObject.rows.length === 0) {
        throw '{ "message": "This user does not exist!"}';
      }

      return req.params.user_id;
    })
    .then((userID) => {
      return knex.raw(
        'select * from products inner join carts on products.id = carts.product_id where carts.user_id = ?',
        [userID],
      );
    })
    .then((productInfo) => {
      if (productInfo.rows.length === 0) {
        throw '{ "message": "This user has nothing in the cart"}';
      }

      res.send(productInfo.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;

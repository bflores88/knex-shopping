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

router.route('/:user_id/:product_id').post((req, res) => {
  knex
    .raw('select * from users where id = ?', [req.params.user_id])
    .then((userObject) => {
      if (userObject.rows.length === 0) {
        throw '{ "message": "This user does not exist!"}';
      }

      return req.params;
    })
    .then((params) => {
      return knex.raw('select * from products where id = ?', [params.product_id]);
    })
    .then((productObject) => {
      if (productObject.rows.length === 0) {
        throw '{ "message": "This product does not exist!"}';
      }

      return req.params;
    })
    .then((params) => {
      return knex.raw('insert into carts (user_id, product_id) values (?, ?) returning *', [
        params.user_id,
        params.product_id,
      ]);
    })
    .then((cartObject) => {
      res.send('{ "success": true }');
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;

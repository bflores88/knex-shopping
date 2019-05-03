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

router.route('/:product_id').get((req, res) => {
  knex
    .raw('select * from products where id = ?', [req.params.product_id])
    .then((productObject) => {
      if (productObject.rows.length === 0) {
        throw '{ "message": "Product not found" }';
      }

      res.send(productObject.rows);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.route('/new')
  .post((req, res) => {
    knex
    .raw('select * from products where title = ?', [req.body.title])
    .then(function(productObject) {
      if (productObject.rows.length !== 0) {
        throw '{ "message": "Product already exists" }';
      }
      return req.body;
    })
    .then(function(newProduct) {
      if(!newProduct.title ||
        !newProduct.description ||
        !newProduct.inventory ||
        !newProduct.price){
          throw '{ "message": "Must POST all product fields" }';
        }
        
      return knex.raw('insert into products (title, description, inventory, price) values (?, ?, ?, ?) returning *', [
        newProduct.title,
        newProduct.description,
        newProduct.inventory,
        newProduct.price
      ]);
    })
    .then(function(newProductDetail) {
      res.send(newProductDetail.rows);
    })
    .catch((err) => {
      res.send(err);
    });


  })

module.exports = router;

const express = require('express');
const router = express.Router();
const knex = require('../database');

router.route('/').get((req, res) => {
  knex
    .raw('select * from products')
    .then((productObject) => {
      return res.status(200).send(productObject.rows);
    })
    .catch((err) => {
      return res.status(500).send("{ 'message' : 'Database error' }");
    });
});

router
  .route('/:product_id')
  .get((req, res) => {
    knex
      .raw('select * from products where id = ?', [req.params.product_id])
      .then((productObject) => {
        if (productObject.rows.length === 0) {
          return res.status(404).send('{ "message": "Product not found" }');
        }

        return res.status(200).send(productObject.rows);
      })
      .catch((err) => {
        return res.status(500).send('{ "message": "Database error" }');
      });
  })
  .put((req, res) => {
    if (!req.body.title || !req.body.description || !req.body.inventory || !req.body.price) {
      return res.status(400).send('{ "message": "Fill out all fields! }');
    }

    knex
      .raw('select * from products where id = ?', [req.params.product_id])
      .then((productObject) => {
        if (productObject.rows.length === 0) {
          return res.status(404).send(`{ "message": "Product id: ${req.params.product_id} not found" }`);
        }

        return knex.raw(
          'update products set title = ?, description = ?, inventory = ?, price = ? where id = ? returning * ',
          [req.body.title, req.body.description, req.body.inventory, req.body.price, req.params.product_id],
        );
      })
      .then(function(updatedProduct) {
        return res.status(200).send(`{ "message": "Product: ${req.params.product_id} has been updated" }`);
      })
      .catch((err) => {
        return res.status(400).send('{ "message": "Database error" }');
      });
  })
  .delete((req, res) => {
    knex
      .raw('select * from products where id = ?', [req.params.product_id])
      .then((productObject) => {
        if (productObject.rows.length === 0) {
          return res.status(404).send(`{ "message": "Product id: ${req.params.product_id} not found" }`);
        }

        return knex.raw('delete from products where id = ? returning *', [req.params.product_id]);
      })
      .then(function(deletedProduct) {
        return res.status(200).send(`{ "message": "Product: ${req.params.product_id} successfully deleted" }`);
      })
      .catch((err) => {
        return res.status(500).send('{ "message": "Database error" }');
      });
  });

router.route('/new').post((req, res) => {
  knex
    .raw('select * from products where title = ?', [req.body.title])
    .then(function(productObject) {
      if (productObject.rows.length !== 0) {
        return res.status(400).send('{ "message": "Product already exists" }');
      }
      return req.body;
    })
    .then(function(newProduct) {
      if (!newProduct.title || !newProduct.description || !newProduct.inventory || !newProduct.price) {
        return res.status(400).send('{ "message": "Must POST all product fields" }');
      }

      return knex.raw('insert into products (title, description, inventory, price) values (?, ?, ?, ?) returning *', [
        newProduct.title,
        newProduct.description,
        newProduct.inventory,
        newProduct.price,
      ]);
    })
    .then(function(newProductDetail) {
      return res.status(200).send(newProductDetail.rows);
    })
    .catch((err) => {
      return res.status(500).send('{ "message": "Database error" }');
    });
});

module.exports = router;

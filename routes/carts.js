const express = require('express');
const router = express.Router();
const knex = require('../database');

router.route('/:user_id').get((req, res) => {
  knex
    .raw('select * from users where id = ?', [req.params.user_id])
    .then((userObject) => {
      if (userObject.rows.length === 0) {
        return res.status(404).send('{ "message": "This user does not exist!"}');
      } else {
        return knex
          .raw('select * from products inner join carts on products.id = carts.product_id where carts.user_id = ?', [
            userID,
          ])
          .then((productInfo) => {
            if (productInfo.rows.length === 0) {
              return res.status(404).send('{ "message": "This user has nothing in the cart"}');
            }

            return res.status(200).send(productInfo.rows);
          });
      }
    })
    .catch((err) => {
      return res.status(500).send('{ "message": "Database error"}');
    });
});

router
  .route('/:user_id/:product_id')
  .post((req, res) => {
    knex
      .raw('select * from users where id = ?', [req.params.user_id])
      .then((userObject) => {
        if (userObject.rows.length === 0) {
          return res.status(404).send('{ "message": "This user does not exist!"}');
        }

        let params = req.params;
        return knex.raw('select * from products where id = ?', [params.product_id]).then((productObject) => {
          if (productObject.rows.length === 0) {
            return res.status(404).send('{ "message": "This product does not exist!"}');
          }

          let params = req.params;
          return knex
            .raw('insert into carts (user_id, product_id) values (?, ?) returning *', [
              params.user_id,
              params.product_id,
            ])
            .then((cartObject) => {
              return res.status(200).send('{ "success": true }');
            });
        });
      })
      .catch((err) => {
        return res.status(500).send('{ "message": "Database error"}');
      });
  })
  .delete((req, res) => {
    knex
      .raw('select * from users where id = ?', [req.params.user_id])
      .then((userObject) => {
        if (userObject.rows.length === 0) {
          return res.status(404).send('{ "message": "This user does not exist!"}');
        }

        let params = req.params;
        return knex.raw('select * from products where id = ?', [params.product_id]).then((productObject) => {
          if (productObject.rows.length === 0) {
            return res.status(404).send('{ "message": "This product does not exist!"}');
          }

          let params = req.params;
          return knex
            .raw('select from carts where user_id = ? and product_id = ?', [params.user_id, params.product_id])
            .then((productObject) => {
              if (productObject.rows.length === 0) {
                return res
                  .status(404)
                  .send(
                    `{ "message": "User ID: ${req.params.user_id} does not have any products with Product ID: ${
                      req.params.product_id
                    } in the cart!"}`,
                  );
              }

              let params = req.params;
              return knex
                .raw('delete from carts where user_id = ? and product_id = ? returning *', [
                  params.user_id,
                  params.product_id,
                ])
                .then((cartObject) => {
                  return res.status(200).send('{ "success": true }');
                });
            });
        });
      })
      .catch((err) => {
        return res.status(500).send('{ "message": "Database error"}');
      });
  });

module.exports = router;

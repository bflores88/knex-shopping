const express = require('express');
const router = express.Router();
const knex = require('../database');

router
  .route('/:user_id')
  .get((req, res) => {
    knex
      .raw('select * from users where id = ?', [req.params.user_id])
      .then(function(userObject) {
        if (userObject.rows.length === 0) {
          return res.status(404).send('{ "message": "User not found!" }');
        }
        
        return res.status(200).send(userObject.rows);
      })
      .catch((err) => {
        return res.status(500).send(`{ message: 'Database error' }`);
      });
  })
  .delete((req, res) => {
    knex
      .raw('select * from users where id = ?', [req.params.user_id])
      .then(function(userObject) {
        if (userObject.rows.length === 0) {
          return res.status(404).send('{ "message": "User ID not found" }');
        }

        let userDetail = userObject.rows[0];

        return knex.raw('delete from users where id = ? returning *', [userDetail.id]);
      })
      .then(function(deleteReturn) {
        return res.status(200).send(`{ "message": "User id: ${req.params.user_id} successfully deleted" }`);
      })
      .catch((err) => {
        return res.status(500).send('{ "message": "Database error" }');
      });
  });

router.route('/:user_id/forgot-password').put((req, res) => {
  if (req.body.password === '') {
    return res.status(400).send('{ "message": "Insert new password!" }');
  }

  knex
    .raw('update users set password = ? where id = ?', [req.body.password, req.params.user_id])
    .then(function() {
      return res.status(200).send('{ "message": "New password created!" }');
    })
    .catch((err) => {
      return res.status(500).send('{ "message": "Database error" }');
    });
});

router.route('/login').post((req, res) => {
  knex
    .raw('select * from users where email = ?', [req.body.email])
    .then(function(userObject) {
      if (userObject.rows.length === 0) {
        return res.status(404).send('{ "message": "User not found" }');
      }

      return userObject.rows[0];
    })
    .then(function(userRows) {
      if (req.body.password !== userRows.password) {
        throw '{ "message": "Incorrect password" }';
      }

      return res.status(200).send(userRows);
    })
    .catch((err) => {
      return res.status(500).send('{ "message": "Database error" }');
    });
});

router.route('/register').post((req, res) => {
  knex
    .raw('select * from users where email = ?', [req.body.email])
    .then(function(userObject) {
      if (userObject.rows.length !== 0) {
        return res.status(400).send('{ "message": "User already exists" }');
      }
      return req.body;
    })
    .then(function(newUser) {
      return knex.raw('insert into users (email, password) values (?, ?) returning *', [
        newUser.email,
        newUser.password,
      ]);
    })
    .then(function(newUserDetail) {
      return res.status(200).send(newUserDetail.rows);
    })
    .catch((err) => {
      return res.status(500).send('{ "message": "Database error" }');
    });
});

module.exports = router;

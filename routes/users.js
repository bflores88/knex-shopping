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
          throw err;
        }
        
        res.status(200);
        res.send(userObject.rows);
        process.exit();
      })
      .catch((err) => {
        res.status(400);
        res.send(`{ message: 'User not found' }`);
      });
  })
  .delete((req, res) => {
    knex
      .raw('select * from users where id = ?', [req.params.user_id])
      .then(function(userObject) {
        if (userObject.rows.length === 0) {
          throw '{ "message": "User ID not found" }';
        }

        let userDetail = userObject.rows[0];

        return knex.raw('delete from users where id = ? returning *', [userDetail.id]);
      })
      .then(function(deleteReturn) {
        res.status(200);
        res.send(`{ "message": "User id: ${req.params.user_id} successfully deleted" }`);
      })
      .catch((err) => {
        res.status(400);
        res.send(err);
      });
  });

router.route('/:user_id/forgot-password').put((req, res) => {
  if (req.body.password === '') {
    res.status(400);
    res.send('{ "message": "Insert new password!" }');
    return;
  }

  knex
    .raw('update users set password = ? where id = ?', [req.body.password, req.params.user_id])
    .then(function() {
      res.status(400);
      res.send('{ "message": "New password created!" }');
      return;
    })
    .catch((err) => {
      throw err;
    });
});

router.route('/login').post((req, res) => {
  knex
    .raw('select * from users where email = ?', [req.body.email])
    .then(function(userObject) {
      if (userObject.rows.length === 0) {
        throw '{ "message": "User not found" }';
      }

      return userObject.rows[0];
    })
    .then(function(userRows) {
      if (req.body.password !== userRows.password) {
        throw '{ "message": "Incorrect password" }';
      }

      res.status(200);
      res.send(userRows);
      process.exit();
    })
    .catch((err) => {
      res.status(400);
      res.send(err);
    });
});

router.route('/register').post((req, res) => {
  knex
    .raw('select * from users where email = ?', [req.body.email])
    .then(function(userObject) {
      if (userObject.rows.length !== 0) {
        throw '{ "message": "User already exists" }';
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
      res.status(200);
      res.send(newUserDetail.rows);
    })
    .catch((err) => {
      res.status(400);
      res.send(err);
    });
});

module.exports = router;

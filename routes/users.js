const express = require('express');
const router = express.Router();
const knex = require('../database');

router.route('/').get((req, res) => {
  res.send('what');
});

router.route('/:user_id').get((req, res) => {
  knex
    .raw('select * from users where id = ?', [req.params.user_id])
    .then(function(userObject) {
      if (userObject.rows.length === 0) {
        throw err;
      }

      res.send(userObject.rows);
      process.exit();
    })
    .catch((err) => {
      res.send(`{ message: 'User not found' }`);
    });
});

router.route('/login').post((req, res) => {
let query = req.body.email;
  
  knex
    .raw('select * from users where email = ?', [query])
    .then(function(userObject) {
      if(userObject.rows.length === 0){
        throw '{ "message": "User not found" }';
      }
      
      return userObject.rows[0];
    })
    .then(function(userRows){
      if(req.body.password !== userRows.password){
        throw '{ "message": "Incorrect password" }';
      }

      res.send(userRows);
      process.exit();
    })
    .catch((err) => {
      res.send(err);
    })
    
});

module.exports = router;

const express = require('express');
const router = express.Router();
const knex = require('../database');


router.route('/')
  .get((req, res) => {
    res.send('what')
  });

router.route('/:user_id')
  .get((req,res) => {
    let queryID = req.params.user_id;

    knex.raw('select * from users where id = ?', [queryID])
    .then(function(userObject){
      if(userObject.rows.length === 0){throw err};

      res.send(userObject.rows);
    })
    .catch((err) => {
      res.send(`{ message: 'User not found' }`)
    })

  });



module.exports = router;


//test
// knex.select().from('products')
//   .then((result) => {
//     console.log(result);
//     process.exit();
//   });

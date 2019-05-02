const knex = require('./database');

knex.select().from('products')
  .then((result) => {
    console.log(result);
    process.exit();
  });

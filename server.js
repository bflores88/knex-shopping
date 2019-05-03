'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

const users = require(`./routes/users.js`);
const products = require(`./routes/products.js`);
const carts = require(`./routes/carts.js`);
const purchases = require(`./routes/purchases.js`);

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.get('/', (req, res) => {
  res.send('smoke test');
});

app.use('/users', users);

app.use('/products', products);

app.use('/carts', carts);

app.use('/purchases', purchases);

const server = app.listen(PORT, () => {
  console.log(`Express app is running at port ${PORT}`);
});
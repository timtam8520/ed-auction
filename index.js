const express = require('express');
const cors = require('cors');

const users = require('./src/users/GET-users/get-users');
const products = require('./src/products/GET-products/get-products');
const product = require('./src/products/GET-productById/get-productById');

const PORT = 3000;
const app = express();

app.use(cors());

// USERS
app.get('/users', (req, res) => res.json(users.get()));

// PRODUCTS
app.get('/products', (req, res) => res.json(products.get()));
app.get('/products/:id', (req, res) => res.json(product.getID(req.params.id)));

// PRODUCT BIDS
// app.get('/products/:productId/bids', (req, res) => )

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Auction API is running at localhost: ${PORT}`));

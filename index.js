const express = require('express');
const cors = require('cors');

const users = require('./src/users/GET/handler');
const products = require('./src/products/GET-id/handler');

const PORT = 3000;
const app = express();

app.use(cors());

// USERS
app.get('/users', (req, res) => res.json(users.get()));

// PRODUCTS
app.get('/products/:id', (req, res) => {
    res.json(products.get(req.params.id));
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Auction API is running at localhost: ${PORT}`));
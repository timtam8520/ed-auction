import cors from 'cors';
import express from 'express';

import bodyparser from 'body-parser';

// import * as product from './products/GET-productById/get-productById';
import { getProducts } from './products/GET-products/get-products';
// import * as users from './users/GET-users/get-users';
import { login, verify } from './shared/services/jwt.service';

const PORT = 3000;
const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

// AUTHENTICATION
app.post('/users/authenticate', (req, res) => {
  login(req, res);
});

// PRODUCTS
app.get('/products', verify, (req, res) => getProducts(res));
// app.get('/products/:id', (req, res) => res.json(product.getID(req.params.id)));


// USERS
// app.get('/users', (req, res) => {
//   // eslint-disable-next-line
//   res.json(users.get());
// });

// BIDS

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Auction API is running at localhost: ${PORT}`));

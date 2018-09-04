import * as cors from 'cors';
import * as  express from 'express';

import * as bodyparser from 'body-parser';

// import * as product from './products/GET-productById/get-productById';
// import products from './products/GET-products/get-products';
// import users from './users/GET-users/get-users';
import * as jwtService from './shared/services/jwt.service';

const PORT = 3000;
const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());

// USERS
// app.get('/users', (req, res) => {
//   // eslint-disable-next-line
//   res.json(users.get());
// });
app.post('/users/authenticate', (req, res) => {
  const response = jwtService.login(req.body);
  res.send(response[1]);
});

// PRODUCTS
// app.get('/products', (req, res) => res.json(products.get()));
// app.get('/products/:id', (req, res) => res.json(product.getID(req.params.id)));

// PRODUCT BIDS
// app.get('/products/:productId/bids', (req, res) => )

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Auction API is running at localhost: ${PORT}`));

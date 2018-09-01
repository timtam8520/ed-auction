const express = require('express');
const cors = require('cors');

const { users } = require('./resources/data');

const PORT = 3000;
const app = express();

app.use(cors());

app.get('/users', (req, res) => res.json(users));

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Auction API is running at localhost: ${PORT}`));
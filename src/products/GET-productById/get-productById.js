const { products } = require('../../../resources/data');

function getID(id) {
  return products.get(Number(id));
}

module.exports = {
  getID
};

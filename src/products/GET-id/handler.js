const { products } = require('../../../resources/data');

function getID(id) {
  if (id > products.length) {
    return null;
  }
  return products[Number(id) - 1];
}

module.exports = {
  getID
};

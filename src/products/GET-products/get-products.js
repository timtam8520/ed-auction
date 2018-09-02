const { products } = require('../../../resources/data');

function get() {
  return Array.from(products.values());
}

module.exports = {
  get
};

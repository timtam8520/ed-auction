const { products } = require('../../../resources/data');

function get() {
  return products;
}

module.exports = {
  get
};

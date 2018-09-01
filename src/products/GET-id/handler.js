const { products } = require('../../../resources/data');

function get(id) {
    if (id > products.length) {
        return null;
    }
    return products[Number(id) - 1];
}

module.exports = {
    get
};
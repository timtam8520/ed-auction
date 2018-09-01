const { users } = require('../../../resources/data');

function get() {
  return users;
}

module.exports = {
  get
};

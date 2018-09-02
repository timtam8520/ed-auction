const { users } = require('../../../resources/data');

function get() {
  return Array.from(users.values());
}

module.exports = {
  get
};

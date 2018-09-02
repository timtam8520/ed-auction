const sinon = require('sinon');
const { expect } = require('chai');

const getUsers = require('./get-users');

describe('get-users', () => {
  let sandbox = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be able to return an array of users', () => {
    const users = getUsers.get();
    expect(users).to.be.an('array');
    expect(users).to.have.length.gte(2);
  });

});


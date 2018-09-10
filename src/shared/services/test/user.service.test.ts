import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import { User } from '../../models/user';
import * as data from '../../resources/data';
import * as userService from '../user.service';

describe('user.service', () => {
  let sandbox: SinonSandbox;

  let getUsersStub: SinonStub;
  let getUserMockData: User[];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    getUserMockData = [
      {
        userId: 1,
        firstName: 'First',
        lastName: 'Last',
        userEmail: 'user@email.com',
        password: 'password'
      }
    ];
    getUsersStub = sandbox.stub(data, 'getUsers').returns(getUserMockData);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle when getUsers is unable to return any data', () => {
    getUsersStub.returns(null);
    const user = userService.validateUserCredentials('user@email.com', 'password');
    expect(user).to.be.null;
  });

  it('should be able to handle when no email is provided', () => {
    const user = userService.validateUserCredentials(null, 'password');
    expect(user).to.be.undefined;
  });

  it('should be able to handle when no password is provided', () => {
    const user = userService.validateUserCredentials('user@email.com', null);
    expect(user).to.be.undefined;
  });

  it('should be able to handle when no email and password is provided', () => {
    const user = userService.validateUserCredentials(null, null);
    expect(user).to.be.undefined;
  });

  it('should be able to handle when both email and password are provided', () => {
    const user = userService.validateUserCredentials('user@email.com', 'password');
    expect(user).to.deep.equal(getUserMockData[0]);
  });
});

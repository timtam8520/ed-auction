import sinon, { SinonSandbox, SinonStub, SinonStatic } from 'sinon';
import { expect } from 'chai';
import * as userService from '../user.service';
import { MockResponse } from '../../../../test/utils.mock.response';
import { User } from '../../models/user';

import proxyquire from 'proxyquire';

let sandbox: SinonSandbox = sinon.createSandbox();

let mockPrivateContents = 'i am the private key';
let mockPublicContents = 'i am the public key';
let readFileSyncStub: SinonStub = sandbox.stub()
  .onFirstCall().returns(mockPrivateContents)
  .onSecondCall().returns(mockPublicContents);
let mockFS: any = {
  readFileSync: readFileSyncStub
};

let jwtSignedMockData = 'e74mds)nJN:"}{2.&*jn';
let mockUserAuthData = {
  userId: 1,
  firstName: 'first',
  lastName: 'last',
  email: 'user@email.com',
  iat: 1123234445
};
let jwtSignStub: SinonStub = sandbox.stub().returns(jwtSignedMockData);
let jwtVerifyStub: SinonStub = sandbox.stub().returns(mockUserAuthData);
let mockJWT: any = {
  sign: jwtSignStub,
  verify: jwtVerifyStub
};

const jwtService = proxyquire('../jwt.service', {
  'fs': mockFS,
  'jsonwebtoken': mockJWT
});

describe('jwt.service', () => {

  let validateUserCredentialsStub: SinonStub;
  let mockUser: User;

  let consoleErrorStub: SinonStub;

  let loginReq: any;
  let verifyReq: any;
  let getUserIdReq: any;
  let res: any;
  let next: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    mockUser = {
      userId: 1,
      firstName: 'first',
      lastName: 'last',
      password: 'a password',
      userEmail: 'user@email.com'
    };
    validateUserCredentialsStub = sandbox.stub(userService, 'validateUserCredentials').returns(mockUser);

    consoleErrorStub = sandbox.stub(console, 'error');

    loginReq = {
      body: {
        username: 'user',
        password: 'password'
      }
    };
    verifyReq = {
      headers: {
        authorization: `Bearer ${jwtSignedMockData}`
      }
    };

    res = new MockResponse();
    next = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
    jwtSignStub.resetHistory();
    jwtVerifyStub.resetHistory();
    jwtVerifyStub.returns(mockUserAuthData);
  });

  it('should read private and public cert from the correct directory', () => {
    const cert_dir = 'C:\\Users\\timtam-Lenovo\\.ssh';
    const private_cert_loc = cert_dir + '\\id_rsa_ed-auction-api';
    const public_cert_loc = cert_dir + '\\id_rsa_ed-auction-api.pub';
    jwtService.login(loginReq, res);
    expect(process.env.CERT_DIR).to.equal(cert_dir);
    expect(readFileSyncStub.getCall(0).args).to.deep.equal([private_cert_loc, 'utf-8']);
    expect(readFileSyncStub.getCall(1).args).to.deep.equal([public_cert_loc, 'utf-8']);
  });

  it('should return 403 forbidden if username is not provided for login', () => {
    delete loginReq.body.username;
    jwtService.login(loginReq, res);
    expect(res.httpStatus).to.equal(403);
    expect(res.payload).to.equal('Forbidden');
  });

  it('should return 403 forbidden if password is not provided for login', () => {
    delete loginReq.body.password;
    jwtService.login(loginReq, res);
    expect(res.httpStatus).to.equal(403);
    expect(res.payload).to.equal('Forbidden');
  });

  it('should return 403 forbidden if username & password are not provided for login', () => {
    delete loginReq.body.username;
    delete loginReq.body.password;
    jwtService.login(loginReq, res);
    expect(res.httpStatus).to.equal(403);
    expect(res.payload).to.equal('Forbidden');
  });

  it('should return 401 unauthorised if username & password provided are incorrect for login', () => {
    validateUserCredentialsStub.returns(null);
    jwtService.login(loginReq, res);
    expect(res.httpStatus).to.equal(401);
    expect(res.payload).to.equal('Incorrect username or password');
  });

  it('should be able to return the user details without the password to sign as a token', () => {
    const userDetails = Object.assign({}, mockUser);
    delete userDetails.password;
    jwtService.login(loginReq, res);
    expect(jwtSignStub.getCall(0).args[0]).to.deep.equal(userDetails);
  });

  it('should be able to handle a un expected failure', () => {
    const err = { message: 'an unexpected err' };
    validateUserCredentialsStub.throws(err);
    jwtService.login(loginReq, res);
    expect(consoleErrorStub.getCall(0).args).to.deep.equal([err]);
    expect(res.httpStatus).to.equal(500);
    expect(res.payload).to.equal('Internal Server Error');
  });

  it('should be able to return the signed token in a 200 ok response using the private certificate with the RS256 algorithm', () => {
    jwtService.login(loginReq, res);
    expect(jwtSignStub.getCall(0).args.slice(1)).to.deep.equal([mockPrivateContents, { algorithm: 'RS256' }]);;
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal({ token: jwtSignedMockData });
  });

  it('should return 403 forbidden for any requests that do not have an authorization header', () => {
    delete verifyReq.headers.authorization;
    jwtService.verify(verifyReq, res, next);
    expect(res.httpStatus).to.equal(403);
    expect(res.payload).to.equal('Forbidden');
    expect(next.callCount).to.equal(0);
  });

  it('should handle when a bearer token is malformed', () => {
    verifyReq.headers.authorization = `Bearer${jwtSignedMockData}`;
    const err = { msg: 'Malformed token' };
    jwtVerifyStub.throws(err);
    jwtService.verify(verifyReq, res, next);
    expect(consoleErrorStub.getCall(0).args).to.deep.equal([err]);
    expect(jwtVerifyStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(403);
    expect(res.payload).to.equal('Forbidden');
    expect(next.callCount).to.equal(0);
  });

  it('should handle when a token is invalid', () => {
    const err = { message: 'Invalid token' };
    jwtVerifyStub.throws(err);
    jwtService.verify(verifyReq, res, next);
    expect(consoleErrorStub.getCall(0).args).to.deep.equal([err]);
    expect(jwtVerifyStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(403);
    expect(res.payload).to.equal('Forbidden');
    expect(next.callCount).to.equal(0);
  });

  it('should handle an unexpected failure', () => {
    jwtService.verify(null, res, next);
    expect(res.httpStatus).to.equal(500);
    expect(res.payload).to.equal('Internal Server Error');
  });

  it('should forward the request to the next handler if the token is valid and signature verified', () => {
    jwtService.verify(verifyReq, res, next);
    expect(jwtVerifyStub.callCount).to.equal(1);
    expect(verifyReq['authData']).to.deep.equal(mockUserAuthData);
    expect(next.callCount).to.equal(1);
  });

  it('should handle a request that has not authData in it', () => {
    let error;
    try {
      jwtService.getUserId(loginReq);
    } catch (err) {
      error = err;
    }
    expect(error).to.not.be.null;
    expect(consoleErrorStub.getCall(0).args).to.deep.equal(['Could not get user id from request']);
  });

  it('should be able to get the user id from a request that has already been verified', () => {
    jwtService.verify(verifyReq, res, next);
    const userId = jwtService.getUserId(verifyReq);
    expect(userId).to.equal(mockUserAuthData.userId);
  });
});

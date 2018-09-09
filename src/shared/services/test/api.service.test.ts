import { expect } from 'chai';
import { MockResponse } from '../../../../test/utils.mock.response';
import * as api from '../api.service';

describe('api.service', () => {
  let res: any;

  beforeEach(() => {
    res = new MockResponse();
  });

  it('should send a 200 ok response when calling ok with no params', () => {
    api.ok(res);
    expect(res.httpStatus).to.be.equal(200);
    expect(res.payload).to.be.deep.equal({});
  });

  it('should send a 200 ok response with the given payload', () => {
    const payload = [1, null, { msg: 'has a property' }, undefined];
    api.ok(res, payload);
    expect(res.httpStatus).to.be.equal(200);
    expect(res.payload).to.be.deep.equal(payload);
  });

  it('should send a 400 bad request response with no custom msg', () => {
    api.badRequest(res);
    expect(res.httpStatus).to.be.equal(400);
    expect(res.payload).to.be.deep.equal('Bad Request');
  });

  it('should send a 400 bad request response with a custom msg', () => {
    const msg = 'another message';
    api.badRequest(res, msg);
    expect(res.httpStatus).to.be.equal(400);
    expect(res.payload).to.be.deep.equal(msg);
  });

  it('should send a 401 unauthorised response with no custom msg', () => {
    api.unauthorised(res);
    expect(res.httpStatus).to.be.equal(401);
    expect(res.payload).to.be.deep.equal('Unauthorised');
  });

  it('should send a 401 unauthorised response with a custom msg', () => {
    const msg = 'another message';
    api.unauthorised(res, msg);
    expect(res.httpStatus).to.be.equal(401);
    expect(res.payload).to.be.deep.equal(msg);
  });

  it('should send a 403 forbidden response', () => {
    api.forbidden(res);
    expect(res.httpStatus).to.be.equal(403);
    expect(res.payload).to.be.deep.equal('Forbidden');
  });

  it('should send a 404 not found response with no custom msg', () => {
    api.notFound(res);
    expect(res.httpStatus).to.be.equal(404);
    expect(res.payload).to.be.deep.equal('Not Found');
  });

  it('should send a 404 not found response with a custom msg', () => {
    const msg = 'another message';
    api.notFound(res, msg);
    expect(res.httpStatus).to.be.equal(404);
    expect(res.payload).to.be.deep.equal(msg);
  });

  it('should send a 409 conflict response with no custom msg', () => {
    api.conflict(res);
    expect(res.httpStatus).to.be.equal(409);
    expect(res.payload).to.be.deep.equal('Conflict');
  });

  it('should send a 409 conflict response with a custom msg', () => {
    const msg = 'another message';
    api.conflict(res, msg);
    expect(res.httpStatus).to.be.equal(409);
    expect(res.payload).to.be.deep.equal(msg);
  });

  it('should send a 500 internal server error response', () => {
    api.internalServerError(res);
    expect(res.httpStatus).to.be.equal(500);
    expect(res.payload).to.be.deep.equal('Internal Server Error');
  });
});

import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import { MockResponse } from '../../../test/utils.mock.response';
import * as jwtService from '../../shared/services/jwt.service';
import * as productService from '../../shared/services/product.service';
import * as bidService from '../../shared/services/bid.service';
import * as handler from './get-bidStatusByProductId';

describe('get-bidStatusByProductId', () => {
  let sandbox: SinonSandbox;

  // JWT Service
  let getUserIdStub: SinonStub;

  // Product Service
  let invalidProductIdStub: SinonStub;

  // Bid Service
  let leadingAuctionStub: SinonStub;
  let auctionClosedStub: SinonStub;
  let partOfAuction: SinonStub;

  let consoleErrorStub: SinonStub;

  let req: any;
  let res: any;

  function status(status: string) {
    return {
      status
    };
  }

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    getUserIdStub = sandbox.stub(jwtService, 'getUserId').returns(1);

    invalidProductIdStub = sandbox.stub(productService, 'invalidProductId').returns(false);

    leadingAuctionStub = sandbox.stub(bidService, 'leadingAuction').returns(true);
    auctionClosedStub = sandbox.stub(bidService, 'auctionClosed').returns(false);
    partOfAuction = sandbox.stub(bidService, 'partOfAuction').returns(true);

    consoleErrorStub = sandbox.stub(console, 'error');

    req = {
      params: {
        productId: 1
      }
    };
    res = new MockResponse();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a 404 for a product that does not exist', () => {
    invalidProductIdStub.returns(true);
    handler.bidStatus(req, res);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(404);
    expect(res.payload).to.equal('Product not found');
  });

  it('should be able to handle an unexpected failure', () => {
    const err = { message: 'could not get the user id at this time' };
    getUserIdStub.throws(err);
    handler.bidStatus(req, res);
    expect(getUserIdStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(500);
    expect(res.payload).to.equal('Internal Server Error');
  });

  it('should be able to report when auction is closed that a user has won the auction', () => {
    auctionClosedStub.returns(true);
    handler.bidStatus(req, res);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(leadingAuctionStub.callCount).to.equal(1);
    expect(partOfAuction.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal(status('You have won this auction. Congratulations'));
  });

  it('should be able to report when auction is closed that a user has lost the auction', () => {
    auctionClosedStub.returns(true);
    leadingAuctionStub.returns(false);
    handler.bidStatus(req, res);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(leadingAuctionStub.callCount).to.equal(1);
    expect(partOfAuction.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal(status('You have lost this auction, better luck next time'));
  });

  it('should be able to report when auction is closed that a user was not part of the auction', () => {
    auctionClosedStub.returns(true);
    leadingAuctionStub.returns(false);
    partOfAuction.returns(false);
    handler.bidStatus(req, res);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(leadingAuctionStub.callCount).to.equal(1);
    expect(partOfAuction.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal(status('You were not part of this auction'));
  });

  it('should be able to report when auction is open that a user is leading the auction', () => {
    handler.bidStatus(req, res);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(leadingAuctionStub.callCount).to.equal(1);
    expect(partOfAuction.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal(status('Your bid is the highest and you are leading the auction'));
  });

  it('should be able to report when auction is open that a user has been outbid', () => {
    leadingAuctionStub.returns(false);
    handler.bidStatus(req, res);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(leadingAuctionStub.callCount).to.equal(1);
    expect(partOfAuction.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal(status('You have been outbid, bid higher to lead the auction'));
  });

  it('should be able to report when auction is open that a user has not been in the auction', () => {
    leadingAuctionStub.returns(false);
    partOfAuction.returns(false);
    handler.bidStatus(req, res);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(leadingAuctionStub.callCount).to.equal(1);
    expect(partOfAuction.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal(status('You haven\'t bid yet, place your first bid'));
  });
});

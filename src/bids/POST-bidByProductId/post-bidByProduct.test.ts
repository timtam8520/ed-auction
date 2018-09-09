import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import * as productService from '../../shared/services/product.service';
import * as bidService from '../../shared/services/bid.service';
import * as jwtService from '../../shared/services/jwt.service';
import { MockResponse } from '../../../test/utils.mock.response';
import * as handler from './post-bidByProductId';
import { Bid } from '../../shared/models/bids';

describe('post-bidByProduct', () => {
  let sandbox: SinonSandbox

  // Product Service stubs
  let invalidProductIdStub: SinonStub;
  let getProductLatestUpdateTimeStub: SinonStub;
  let addBidToProductStub: SinonStub;

  // Bid Service stubs
  let invalidBidStub: SinonStub;
  let auctionClosedStub: SinonStub;
  let addBidStub: SinonStub;

  // JWT Service
  let getUserIdStub: SinonStub;

  // Date
  let dateNowStub: SinonStub;

  // Console
  let consoleErrorStub: SinonStub;

  let req: any;
  let res: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    invalidProductIdStub = sandbox.stub(productService, 'invalidProductId').returns(false);
    getProductLatestUpdateTimeStub = sandbox.stub(productService, 'getProductLatestUpdateTime').returns(0);
    addBidToProductStub = sandbox.stub(productService, 'addBidToProduct');

    invalidBidStub = sandbox.stub(bidService, 'invalidBid').returns(false);
    auctionClosedStub = sandbox.stub(bidService, 'auctionClosed').returns(false);
    addBidStub = sandbox.stub(bidService, 'addBid');

    getUserIdStub = sandbox.stub(jwtService, 'getUserId').returns(1);

    dateNowStub = sandbox.stub(Date, 'now').returns(1);

    consoleErrorStub = sandbox.stub(console, 'error');

    req = {
      params: {
        productId: '1'
      },
      body: {
        bidPrice: '10.01'
      }
    };
    res = new MockResponse();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a 404 for a bid on a product that does not exist', () => {
    invalidProductIdStub.returns(true);
    handler.bidOnProduct(req, res);
    expect(getProductLatestUpdateTimeStub.callCount).to.equal(1);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(404);
    expect(res.payload).to.equal('Product not found');
  });

  it('should return a 400 for an invalid bid', () => {
    invalidBidStub.returns(true);
    handler.bidOnProduct(req, res);
    expect(getProductLatestUpdateTimeStub.callCount).to.equal(1);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(invalidBidStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(400);
    expect(res.payload).to.equal('Ensure that bid is at least $0.01 greater than current bid');
  });

  it('should return a 400 for placing a bid on a product that is no longer on auction', () => {
    auctionClosedStub.returns(true);
    handler.bidOnProduct(req, res);
    expect(getProductLatestUpdateTimeStub.callCount).to.equal(1);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(invalidBidStub.callCount).to.equal(1);
    expect(auctionClosedStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(400);
    expect(res.payload).to.equal('Auction has ended, no more bids can be accepted');
  });

  it('should not add the bid if another bid had been placed in the meantime', () => {
    getProductLatestUpdateTimeStub.onCall(1).returns(100);
    handler.bidOnProduct(req, res);
    expect(getProductLatestUpdateTimeStub.callCount).to.equal(2);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(invalidBidStub.callCount).to.equal(1);
    expect(auctionClosedStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(409);
    expect(res.payload).to.equal('Product has a higher bid. Please bid again');
  });

  it('should handle an unexpected error', () => {
    const err = { message: 'an unexpected error' };
    getProductLatestUpdateTimeStub.onCall(1).throws(err);
    handler.bidOnProduct(req, res);
    expect(getProductLatestUpdateTimeStub.callCount).to.equal(2);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(invalidBidStub.callCount).to.equal(1);
    expect(auctionClosedStub.callCount).to.equal(1);
    expect(consoleErrorStub.getCall(0).args).to.deep.equal([err]);
    expect(res.httpStatus).to.equal(500);
    expect(res.payload).to.equal('Internal Server Error');
  });

  it('should return a 200 ok response and update the product and add the bid to the bids', () => {
    const bid: Bid = {
      productId: 1,
      userId: 1,
      price: 10.01,
      timestamp: 1
    };
    handler.bidOnProduct(req, res);
    expect(getProductLatestUpdateTimeStub.callCount).to.equal(2);
    expect(invalidProductIdStub.callCount).to.equal(1);
    expect(invalidBidStub.callCount).to.equal(1);
    expect(auctionClosedStub.callCount).to.equal(1);
    expect(addBidStub.getCall(0).args).to.deep.equal([bid]);
    expect(addBidToProductStub.getCall(0).args).to.deep.equal([1, 10.01]);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal({});
  });
});

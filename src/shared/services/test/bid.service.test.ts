import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import * as productService from '../product.service';
import * as data from '../../resources/data';
import * as bidService from '../bid.service';
import { Bid } from '../../models/bids';

describe('bid.service', () => {
  let sandbox: SinonSandbox;

  let getLatestProductPriceStub: SinonStub;
  let getProductByIdStub: SinonStub;

  let addBidToDataStub: SinonStub;

  let dateNowStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    getLatestProductPriceStub = sandbox.stub(productService, 'getLatestProductPrice').returns(1);
    getProductByIdStub = sandbox.stub(productService, 'getProductById').returns({ productAuctionCloseTime: 1 });

    addBidToDataStub = sandbox.stub(data, 'addBidToData');

    dateNowStub = sandbox.stub(Date, 'now').returns(0);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be able to report a bid is invalid when it is less than the latestPrice', () => {
    const invalid = bidService.invalidBid(1, 0.5);
    expect(getLatestProductPriceStub.callCount).to.equal(1);
    expect(invalid).to.be.true;
  });

  it('should be able to handle an undefined bidPrice and report it as invalid', () => {
    const invalid = bidService.invalidBid(1, undefined);
    expect(getLatestProductPriceStub.callCount).to.equal(1);
    expect(invalid).to.be.true;
  });

  it('should be able to report a bid isn\'t invalid when it is greater than the latestPrice', () => {
    const invalid = bidService.invalidBid(1, 1.01);
    expect(getLatestProductPriceStub.callCount).to.equal(1);
    expect(invalid).to.be.false;
  });

  it('should be able to report that an auction has not closed', () => {
    const closed = bidService.auctionClosed(1);
    expect(getProductByIdStub.callCount).to.equal(1);
    expect(closed).to.be.false;
  });

  it('should be able to report that an auction has closed', () => {
    dateNowStub.returns(2);
    const closed = bidService.auctionClosed(1);
    expect(getProductByIdStub.callCount).to.equal(1);
    expect(closed).to.be.true;
  });

  it('should be able to add a bid to the bids data', () => {
    const bid: Bid = {
      productId: 1,
      userId: 1,
      price: 1,
      timestamp: 1
    };
    bidService.addBid(bid);
    expect(addBidToDataStub.getCall(0).args).to.deep.equal([bid]);
  });
});

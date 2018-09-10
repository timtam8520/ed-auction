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
  let getBidsStub: SinonStub;
  let getBidsMockData: Bid[];

  let dateNowStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    getLatestProductPriceStub = sandbox.stub(productService, 'getLatestProductPrice').returns(1);
    getProductByIdStub = sandbox.stub(productService, 'getProductById').returns({ productAuctionCloseTime: 1 });

    addBidToDataStub = sandbox.stub(data, 'addBidToData');
    getBidsMockData = [
      {
        productId: 1,
        userId: 1,
        price: 111,
        timestamp: 1
      },
      {
        productId: 1,
        userId: 2,
        price: 111.5,
        timestamp: 2
      },
      {
        productId: 1,
        userId: 1,
        price: 1010.5,
        timestamp: 3
      }
    ];
    getBidsStub = sandbox.stub(data, 'getBids').returns(getBidsMockData);

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

  it('should be able to handle getting product bids when there are no bids', () => {
    getBidsStub.returns([]);
    const highestBidder = bidService.leadingAuction(1, 1);
    expect(getBidsStub.callCount).to.equal(1);
    expect(highestBidder).to.equal(null);
  });

  it('should be able to handle getting product bids when there are no bids for that product', () => {
    const bids: Bid[] = [
      {
        productId: 2,
        userId: 1,
        price: 10,
        timestamp: 9
      },
      {
        productId: 2,
        userId: 2,
        price: 11,
        timestamp: 20
      }
    ];
    getBidsStub.returns(bids);
    const highestBidder = bidService.leadingAuction(1, 1);
    expect(getBidsStub.callCount).to.equal(1);
    expect(highestBidder).to.equal(null);
  });

  it('should be able to report that you are not the highest bidder, when you\'ve made no bids', () => {
    const leading = bidService.leadingAuction(1, 4);
    expect(getBidsStub.callCount).to.equal(1);
    expect(leading).to.be.false;
  });

  it('should be able to report that you are not the highest bidder, when you\'ve been outbid', () => {
    const leading = bidService.leadingAuction(1, 2);
    expect(getBidsStub.callCount).to.equal(1);
    expect(leading).to.be.false;
  });

  it('should be able to get the report the highest bidder', () => {
    const leading = bidService.leadingAuction(1, 1);
    expect(getBidsStub.callCount).to.equal(1);
    expect(leading).to.be.true;
  });

  it('should be able to handle checking if a user is part of the auction when there are no bids', () => {
    getBidsStub.returns([]);
    const inAuction = bidService.partOfAuction(1, 1);
    expect(getBidsStub.callCount).to.equal(1);
    expect(inAuction).to.be.null;
  });

  it('should be able to handle checking if a user is part of the auction when there are no bids', () => {
    getBidsStub.returns([]);
    const inAuction = bidService.partOfAuction(1, 1);
    expect(getBidsStub.callCount).to.equal(1);
    expect(inAuction).to.be.null;
  });

  it('should be able to report whether a user is part of an auction when there are no bids for that product', () => {
    const bids: Bid[] = [
      {
        productId: 2,
        userId: 1,
        price: 10,
        timestamp: 9
      },
      {
        productId: 2,
        userId: 2,
        price: 11,
        timestamp: 20
      }
    ];
    getBidsStub.returns(bids);
    const inAuction = bidService.partOfAuction(1, 1);
    expect(getBidsStub.callCount).to.equal(1);
    expect(inAuction).to.equal(null);
  })

  it('should be able to report that a user is not part of an auction when they\'ve made no bids', () => {
    const inAuction = bidService.partOfAuction(1, 3);
    expect(getBidsStub.callCount).to.equal(1);
    expect(inAuction).to.be.false;
  });

  it('should be able to report that a user is part of an auction, when they have made bids', () => {
    const inAuction = bidService.partOfAuction(1, 2);
    expect(getBidsStub.callCount).to.equal(1);
    expect(inAuction).to.be.true;
  });
});

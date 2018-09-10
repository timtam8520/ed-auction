import sinon from 'sinon';
import { expect } from 'chai';
import * as data from './data';
import { Product } from '../models/product';
import { Bid } from '../models/bids';

describe('data', () => {
  it('should be able to return the list of products', () => {
    const products = data.getProducts();
    expect(products).to.be.an('array');
    expect(products.length).to.equal(4);
  });

  it('should be able to return the list of users', () => {
    const users = data.getUsers();
    expect(users).to.be.an('array');
    expect(users.length).to.equal(4);
  });

  it('should be able to return the list of bids', () => {
    const bids = data.getBids();
    expect(bids).to.be.an('array');
    expect(bids.length).to.equal(0);
  });

  it('should be able to update a product', () => {
    const product: Product = {
      productId: 500,
      initialProductPrice: 500,
      latestProductBidPrice: 5000,
      latestUpdateTime: 50000,
      productAuctionCloseTime: 5,
      productBids: 5,
      productImage: 'http://5.com',
      productName: 'Five'
    };
    data.updateProduct(4, product);
    const products = data.getProducts();
    expect(products.length).to.equal(4);
    expect(products[3]).to.deep.equal(product);
  });

  it('should be able to add a bid', () => {
    const bid: Bid = {
      productId: 1,
      userId: 1,
      price: 10,
      timestamp: 100
    };
    data.addBidToData(bid);
    const bids = data.getBids();
    expect(bids.length).to.equal(1);
    expect(bids[0]).to.deep.equal(bid);
  });
});

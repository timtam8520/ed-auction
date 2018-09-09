import sinon from 'sinon';
import { expect } from 'chai';
import * as handler from './get-products';
import { Product } from '../../shared/models/product';
import * as productService from '../../shared/services/product.service';
import { MockResponse } from '../../../test/utils.mock.response';

describe.only('get-products', () => {
  let sandbox: any;

  let retrieveProductsStub: any;

  let retrieveProductsMockData: Product[];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    retrieveProductsMockData = [
      {
        productId: 1,
        initialProductPrice: 10,
        productName: 'Product 1',
        productImage: 'a url',
        productBids: 1,
        productAuctionCloseTime: 1,
        latestUpdateTime: 10,
        latestProductBidPrice: 11
      },
      {
        productId: 2,
        initialProductPrice: 60,
        productName: 'Product 2',
        productImage: 'another url',
        productBids: 1,
        productAuctionCloseTime: 1,
        latestUpdateTime: 40,
        latestProductBidPrice: 70
      }
    ];

    retrieveProductsStub = sandbox.stub(productService, 'retrieveProducts').returns(retrieveProductsMockData);
    retrieveProductsStub
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('to return the list of products in a 200 ok response', () => {
    const res = (<any>new MockResponse());
    handler.listProducts(res);
    expect(retrieveProductsStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.equal(retrieveProductsMockData);
  });
});

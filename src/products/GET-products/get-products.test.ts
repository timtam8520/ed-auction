import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import * as handler from './get-products';
import { Product } from '../../shared/models/product';
import * as productService from '../../shared/services/product.service';
import { MockResponse } from '../../../test/utils.mock.response';

describe('get-products', () => {
  let sandbox: SinonSandbox;

  let retrieveProductsStub: SinonStub;
  let retrieveProductsMockData: Product[];

  let consoleErrorStub: SinonStub;

  let res: any;

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

    consoleErrorStub = sandbox.stub(console, 'error');

    res = new MockResponse();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should handle an unexpected failure', () => {
    const err = { message: 'unexpected failure while retrieving products' };
    retrieveProductsStub.throws(err);
    handler.listProducts(res);
    expect(retrieveProductsStub.callCount).to.equal(1);
    expect(consoleErrorStub.getCall(0).args).to.deep.equal([err]);
    expect(res.httpStatus).to.equal(500);
    expect(res.payload).to.equal('Internal Server Error');
  });

  it('should return the list of products in a 200 ok response', () => {
    handler.listProducts(res);
    expect(retrieveProductsStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal(retrieveProductsMockData);
  });
});

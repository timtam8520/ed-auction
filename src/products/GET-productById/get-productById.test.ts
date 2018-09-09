import sinon, { SinonSandbox, SinonStub } from "sinon";
import { expect } from 'chai';
import { Product } from "../../shared/models/product";
import * as productService from "../../shared/services/product.service";
import { MockResponse } from "../../../test/utils.mock.response";
import * as handler from './get-productById';

describe('get-productById', () => {
  let sandbox: SinonSandbox;

  let getProductByIdStub: SinonStub;
  let getProductByIdMockData: Product;

  let req: any;
  let res: any;

  let consoleErrorStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    getProductByIdMockData = {
      productId: 1,
      initialProductPrice: 10,
      productName: 'Product 1',
      productImage: 'a url',
      productBids: 1,
      productAuctionCloseTime: 1,
      latestUpdateTime: 10,
      latestProductBidPrice: 11
    };

    getProductByIdStub = sandbox.stub(productService, 'getProductById').returns(getProductByIdMockData);
    consoleErrorStub = sandbox.stub(console, 'error');

    req = {
      params: {
        productId: '1'
      }
    };
    res = new MockResponse();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return a 404 for when a product does not exist', () => {
    getProductByIdStub.returns(null);
    handler.getProductWithId(req, res);
    expect(getProductByIdStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(404);
    expect(res.payload).to.equal('Product not found');
  });

  it('should handle an unexpected failure', () => {
    const err = { message: 'an unexpected err' };
    getProductByIdStub.throws(err);
    handler.getProductWithId(req, res);
    expect(getProductByIdStub.callCount).to.equal(1);
    expect(consoleErrorStub.getCall(0).args).to.deep.equal([err]);
    expect(res.httpStatus).to.equal(500);
    expect(res.payload).to.equal('Internal Server Error');
  });

  it('should return the product in a 200 ok response', () => {
    handler.getProductWithId(req, res);
    expect(getProductByIdStub.callCount).to.equal(1);
    expect(res.httpStatus).to.equal(200);
    expect(res.payload).to.deep.equal(getProductByIdMockData);
  });
});

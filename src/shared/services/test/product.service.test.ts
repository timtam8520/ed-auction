import sinon, { SinonSandbox, SinonStub } from 'sinon';
import { expect } from 'chai';
import * as data from '../../resources/data';
import * as productService from '../product.service';
import { Product } from '../../models/product';

describe('product.service', () => {
  let sandbox: SinonSandbox;

  let getProductsStub: SinonStub;
  let updateProductStub: SinonStub;
  let getProductsMockData: Product[];

  let dateNowStub: SinonStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    getProductsMockData = [
      {
        productId: 1,
        productName: 'Product 1',
        productImage: '1.com',
        initialProductPrice: 10,
        productBids: 0,
        latestProductBidPrice: 0,
        productAuctionCloseTime: 10,
        latestUpdateTime: 0
      }
    ];
    getProductsStub = sandbox.stub(data, 'getProducts').returns(getProductsMockData);
    updateProductStub = sandbox.stub(data, 'updateProduct');

    dateNowStub = sandbox.stub(Date, 'now').returns(1);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be able to handle an unexpected failure in getting the products', () => {
    getProductsStub.throws({ message: 'Unable to get the products at this time' });
    const products = productService.retrieveProducts();
    expect(products).to.be.null;
  });

  it('should be able to return the list of products', () => {
    const products = productService.retrieveProducts();
    expect(products).to.deep.equal(getProductsMockData);
  });

  it('should be able to handle retrieving non-existent product by id', () => {
    const product = productService.getProductById(2);
    expect(product).to.be.undefined;
  });

  it('should be able to retrieve a product by Id', () => {
    const product = productService.getProductById(1);
    expect(product).to.deep.equal(getProductsMockData[0]);
  });

  it('should be able to correctly flag an invalid productId', () => {
    const invalid = productService.invalidProductId(2);
    expect(invalid).to.be.true;
  });

  it('should be able to correctly flag a valid productId', () => {
    const invalid = productService.invalidProductId(1);
    expect(invalid).to.be.false;
  });

  it('should be able to handle retrieving product lastest time for non-existent product', () => {
    const latestUpdateTime = productService.getProductLatestUpdateTime(2);
    expect(latestUpdateTime).to.be.null;
  });

  it('should be able to handle retrieval of product lastest time', () => {
    const latestUpdateTime = productService.getProductLatestUpdateTime(1);
    expect(latestUpdateTime).to.equal(getProductsMockData[0].latestUpdateTime);
  });

  it('should be able to handle retrieving product lastest price for non-existent product', () => {
    const latestPrice = productService.getLatestProductPrice(2);
    expect(latestPrice).to.be.null;
  });

  it('should be able to handle retrieval of product lastest price from initial price', () => {
    const latestPrice = productService.getLatestProductPrice(1);
    expect(latestPrice).to.equal(getProductsMockData[0].initialProductPrice);
  });

  it('should be able to handle retrieval of product lastest price from latest bid price', () => {
    getProductsMockData[0].latestProductBidPrice = 20;
    const latestPrice = productService.getLatestProductPrice(1);
    expect(latestPrice).to.equal(getProductsMockData[0].latestProductBidPrice);
  });

  it('should be able to handle adding bid details to non-existent product', () => {
    productService.addBidToProduct(2, 300);
    expect(updateProductStub.callCount).to.equal(0);
  });

  it('should be able to add bid details to product', () => {
    productService.addBidToProduct(1, 300);
    const product: Product = Object.assign({}, getProductsMockData[0], {
      latestUpdateTime: 1,
      productBids: 1,
      latestProductBidPrice: 300
    });
    expect(updateProductStub.getCall(0).args).to.deep.equal([1, product]);
  });
});

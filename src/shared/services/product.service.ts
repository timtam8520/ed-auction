import { getProducts, updateProduct } from '../resources/data';

export function retrieveProducts() {
  return getProducts();
}

export function getProductById(productId: number) {
  const products = retrieveProducts();
  const product = products.find(p => p.productId === productId);
  return product;
}

export function validProductId(productId: number) {
  const product = getProductById(productId);
  return product ? true : false;
}

export function getProductLatestUpdateTime(productId: number) {
  const product = getProductById(productId);
  return product.latestUpdateTime;
}

export function getLatestProductPrice(productId: number) {
  const product = getProductById(productId);
  if (product.latestProductBidPrice !== 0) {
    return product.latestProductBidPrice;
  } else {
    return product.initialProductPrice;
  }
}

export function addBidToProduct(productId: number, bidPrice: number) {
  let product = getProductById(productId);
  product = Object.assign({}, product, {
    latestUpdateTime: Date.now(),
    productBids: product.productBids + 1,
    latestProductBidPrice: bidPrice
  });
  updateProduct(productId, product);
}

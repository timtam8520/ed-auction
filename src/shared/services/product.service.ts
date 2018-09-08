import { getProducts, updateProduct } from '../resources/data';

export function validProductId(productId: number) {
  const products = getProducts();
  const product = products.find(p => p.productId === productId);
  return product ? true : false;
}

export function getProductLatestUpdateTime(productId: number) {
  const products = getProducts();
  const product = products.find(p => p.productId === productId);
  return product.latestUpdateTime;
}

export function getLatestProductPrice(productId: number) {
  const products = getProducts();
  const product = products.find(p => p.productId === productId);
  if (product.latestProductBidPrice !== 0) {
    return product.latestProductBidPrice;
  } else {
    return product.initialProductPrice;
  }
}

export function addBidToProduct(productId: number, bidPrice: number) {
  const products = getProducts();
  let product = products.find(p => p.productId === productId);
  product = Object.assign({}, product, {
    latestUpdateTime: Date.now(),
    productBids: product.productBids + 1,
    latestProductBidPrice: bidPrice
  });
  updateProduct(productId, product);
}

import { getProducts, updateProduct } from '../resources/data';

export function retrieveProducts() {
  try {
    return getProducts();
  } catch (err) {
    return null;
  }
}

export function getProductById(productId: number) {
  const products = retrieveProducts();
  if (products) {
    const product = products.find(p => p.productId === productId);
    return product;
  }
}

export function invalidProductId(productId: number) {
  const product = getProductById(productId);
  return product ? false : true;
}

export function getProductLatestUpdateTime(productId: number) {
  const product = getProductById(productId);
  return product ? product.latestUpdateTime : null;
}

export function getLatestProductPrice(productId: number) {
  const product = getProductById(productId);
  if (product) {
    if (product.latestProductBidPrice > 0) {
      return product.latestProductBidPrice;
    } else {
      return product.initialProductPrice;
    }
  } else {
    return null;
  }
}

export function addBidToProduct(productId: number, bidPrice: number) {
  let product = getProductById(productId);
  if (product) {
    product = Object.assign({}, product, {
      latestUpdateTime: Date.now(),
      productBids: product.productBids + 1,
      latestProductBidPrice: bidPrice
    });
    updateProduct(productId, product);
  }
}

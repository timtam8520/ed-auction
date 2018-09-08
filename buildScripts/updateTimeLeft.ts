import fs from 'fs';
import { Product } from '../src/shared/models/product';

const productsLocation = './src/shared/resources/productData.json';
const timeLeft = [
  15 * 60 * 1000,
  10 * 60 * 1000,
  5 * 60 * 1000,
  3 * 60 * 1000
];

const currentTime = Date.now();

const products: Product[] = JSON.parse(fs.readFileSync(productsLocation, 'utf-8'));

for (let i = 0; i < products.length; ++i) {
  products[i] = Object.assign({}, products[i], { productAuctionCloseTime: currentTime + timeLeft[i] });
}

fs.writeFileSync(productsLocation, JSON.stringify(products));

console.log('\x1b[42m%s\x1b[0m','[UPDATED] Products expirations updated to current time');

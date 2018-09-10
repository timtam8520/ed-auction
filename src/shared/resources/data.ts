import { readFileSync } from 'fs';

import { Product } from '../models/product';
import { User } from '../models/user';
import { Bid } from '../models/bids';

const products: Product[] = JSON.parse(readFileSync('./src/shared/resources/productData.json', 'utf-8'));

const users: User[] = [
  {
    firstName: 'Bob',
    lastName: 'Proctor',
    password: 'bob',
    userEmail: 'bob@proctor.com',
    userId: 1,
  },
  {
    firstName: 'Susie',
    lastName: 'Jane',
    password: 'susie',
    userEmail: 'susie@jane.com',
    userId: 2,
  },
  {
    firstName: 'Peter',
    lastName: 'Thompson',
    password: 'peter',
    userEmail: 'peter@thompson.com',
    userId: 3,
  },
  {
    firstName: 'Sally',
    lastName: 'Christopher',
    password: 'sally',
    userEmail: 'sally@christopher.com',
    userId: 4,
  },
];


let bids: Bid[] = [
];

export function getProducts(): Product[] {
  return products;
}

export function getUsers(): User[] {
  return users;
}

export function getBids(): Bid[] {
  return bids;
}

export function updateProduct(productId: number, product: Product) {
  const index = products.indexOf(products.find(p => p.productId === productId));
  products[index] = Object.assign({}, product);
}

export function addBidToData(bid: Bid) {
  bids.push(bid);
}

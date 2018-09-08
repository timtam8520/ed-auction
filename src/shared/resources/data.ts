import fs from 'fs';

import { Product } from '../models/product';
import { User } from '../models/user';
import { Bid } from '../models/bids';

export const products: Product[] = JSON.parse(fs.readFileSync('./src/shared/resources/productData.json', 'utf-8'));

export const users: User[] = [
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


export let bids: Bid[] = [
];

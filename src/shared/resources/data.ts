import { Product } from '../models/product';
import { User } from '../models/user';

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

export const products: Product[] = [
  {
    productId: 1,
    productImage: 'https://www.kmart.com.au/wcsstore/Kmart/images/ncatalog/tf/6/42570936-1-tf.jpg',
    productName: 'Kettle',
  },
  {
    productId: 2,
    productImage: 'https://www.tennisdirect.com.au/assets/full/17538-G2.jpg',
    productName: 'Tennis Racquet',
  },
  {
    productId: 3,
    // tslint:disable-next-line:max-line-length
    productImage: 'https://azcd.harveynorman.com.au/media/catalog/product/cache/21/image/992x558/9df78eab33525d08d6e5fb8d27136e95/h/g/hg90_edit_4.png',
    productName: 'Monitor',
  },
  {
    productId: 4,
    productImage: 'https://i.ebayimg.com/images/g/yA8AAOSw2gxYtsx7/s-l300.jpg',
    productName: 'The Chronicles of Narnia Book Set',
  },
];

// export let bids = [
// ];

// const arrayToMap = (id, arr) => new Map(arr.map((item) => [item[id], item]));

// module.exports = {
//   products: arrayToMap('productId', products),
//   productBids: arrayToMap('productId', bids),
// }; ,
// users: arrayToMap('userId', users),  ;

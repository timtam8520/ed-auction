import { Response } from 'express';
import * as api from '../../shared/services/api.service';
import { retrieveProducts } from '../../shared/services/product.service';

export function listProducts(res: Response) {
  try {
    const products = retrieveProducts();
    return api.ok(res, products);
  } catch (err) {
    console.error(err);
    return api.serverError(res);
  }
}

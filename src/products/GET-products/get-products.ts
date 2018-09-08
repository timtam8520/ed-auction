import { Response } from 'express';
import { ok } from '../../shared/services/api.service';
import { retrieveProducts } from '../../shared/services/product.service';

export function listProducts(res: Response) {
  const products = retrieveProducts();
  return ok(res, products);
}

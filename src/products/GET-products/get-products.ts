import { Response } from 'express';
import { ok } from '../../shared/services/api.service';
import { getProducts } from '../../shared/resources/data';

export function listProducts(res: Response) {
  const products = getProducts();
  return ok(res, products);
}

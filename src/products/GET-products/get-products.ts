import { products } from '../../shared/resources/data';
import { Response } from 'express';
import { ok } from '../../shared/services/api.service';

export function getProducts(res: Response) {
  return ok(res, products);
}

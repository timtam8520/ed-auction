import { Request, Response } from "express";
import { getProductById } from "../../shared/services/product.service";
import * as api from "../../shared/services/api.service";

export function getProductWithId(req: Request, res: Response) {
  try {
    const productId = Number(req.params.productId);
    const product = getProductById(productId);
    if (product == null) {
      return api.notFound(res, 'Product not found');
    } else {
      return api.ok(res, product);
    }
  } catch (err) {
    console.log(err);
    return api.serverError(res);
  }
}

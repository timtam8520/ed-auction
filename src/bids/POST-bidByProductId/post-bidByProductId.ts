import { Request, Response } from "express";
import * as api from "../../shared/services/api.service";
import { invalidProductId, getProductLatestUpdateTime, addBidToProduct } from "../../shared/services/product.service";
import { invalidBid, auctionClosed, addBid } from "../../shared/services/bid.service";
import { getUserId } from "../../shared/services/jwt.service";
import { Bid } from "../../shared/models/bids";

export async function bidOnProduct(req: Request, res: Response) {
  try {
    const productId = Number(req.params.productId);
    const bidPrice = Number(req.body.bidPrice);
    if (invalidProductId(productId)) {
      return api.notFound(res, 'Product not found');
    }
    const latestUpdateTime = getProductLatestUpdateTime(productId);
    if (invalidBid(productId, bidPrice)) {
      return api.badRequest(res, 'Ensure that bid is at least $0.01 greater than current bid');
    } else if (auctionClosed(productId)) {
      return api.badRequest(res, 'Auction has ended, no more bids can be accepted');
    }
    const userId = getUserId(req);
    const bid: Bid = {
      productId,
      userId,
      price: bidPrice,
      timestamp: Date.now()
    };
    // check that the product has not had another bid before this one that is being processed
    if (!(latestUpdateTime === getProductLatestUpdateTime(productId))) {
      return api.conflict(res, 'Product has a higher bid. Please bid again');
    } else {
      addBid(bid);
      addBidToProduct(productId, bidPrice);
    }
    return api.ok(res)
  } catch (err) {
    console.error(err);
    return api.internalServerError(res);
  }
}

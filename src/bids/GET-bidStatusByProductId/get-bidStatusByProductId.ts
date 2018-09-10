import { Request, Response } from "express";
import * as api from '../../shared/services/api.service';
import { getUserId } from "../../shared/services/jwt.service";
import { invalidProductId } from "../../shared/services/product.service";
import { leadingAuction, auctionClosed, partOfAuction } from "../../shared/services/bid.service";

const enum MESSAGES{
  NOT_IN_AUCTION = 'You haven\'t bid yet, place your first bid',
  LEADING_AUCTION = 'Your bid is the highest and you are leading the auction',
  OUTBID = 'You have been outbid, bid higher to lead the auction',
  WON = 'You have won this auction. Congratulations',
  LOST = 'You have lost this auction, better luck next time',
  NA = 'You were not part of this auction'
};

export function bidStatus(req: Request, res: Response) {
  try {
    const productId = Number(req.params.productId);
    const userId = getUserId(req);
    if (invalidProductId(productId)) {
      return api.notFound(res, 'Product not found');
    }
    const leadingBidder = leadingAuction(productId, userId);
    const inAuction = partOfAuction(productId, userId);
    if (auctionClosed(productId)) {
      if (leadingBidder) {
        return api.ok(res, status(MESSAGES.WON));
      } else if (inAuction) {
        return api.ok(res, status(MESSAGES.LOST))
      } else {
        return api.ok(res, status(MESSAGES.NA))
      }
    } else {
        if (leadingBidder) {
          return api.ok(res, status(MESSAGES.LEADING_AUCTION));
        } else if (inAuction) {
          return api.ok(res, status(MESSAGES.OUTBID));
        } else {
          return api.ok(res, status(MESSAGES.NOT_IN_AUCTION))
        }
    }
  } catch (err) {
    console.error(err);
    return api.internalServerError(res);
  }
}

function status(status: string) {
  return {
    status
  };
}

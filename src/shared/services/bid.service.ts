import { getLatestProductPrice, getProductById } from "./product.service";
import { Bid } from "../models/bids";
import { addBidToData } from "../resources/data";

const MIN_BID_DIFF = 0.01;

export function invalidBid(productId: number, bidPrice: number) {
  const latestPrice = getLatestProductPrice(productId);
  if (isNaN(bidPrice) || bidPrice < latestPrice + MIN_BID_DIFF) {
    return true;
  }
  return false;
}

export function auctionClosed(productId: number) {
  const { productAuctionCloseTime } = getProductById(productId);
  const currentTime = Date.now();
  if (currentTime > productAuctionCloseTime) {
    return true;
  }
  return false;
}

export function addBid(bid: Bid) {
  addBidToData(bid);
}

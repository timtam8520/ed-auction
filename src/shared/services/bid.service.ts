import { getLatestProductPrice, getProductById } from "./product.service";
import { Bid } from "../models/bids";
import { addBidToData, getBids } from "../resources/data";

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

function getProductBids(productId: number) {
  const bids = getBids();
  if (bids && bids.length > 0) {
    return bids.filter(b => b.productId === productId);
  } else {
    return null;
  }
}

export function leadingAuction(productId: number, userId: number) {
  const productBids = getProductBids(productId);
  if (productBids && productBids.length > 0) {
    const leadingUserId = productBids.sort(b => b.price)[0].userId;
    return leadingUserId === userId ? true : false;
  }
  return null;
}

export function partOfAuction(productId: number, userId: number) {
  const productBids = getProductBids(productId);
  if (productBids && productBids.length > 0) {
    const userBids = productBids.filter(b => b.userId === userId);
    return userBids.length > 0 ? true : false;
  }
  return null;
}

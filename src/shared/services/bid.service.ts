import { getLatestProductPrice } from "./product.service";
import { Bid } from "../models/bids";
import { addBidToData } from "../resources/data";

const MIN_BID_DIFF = 0.01;

export async function validBid(productId: number, bidPrice: number) {
  const latestPrice = await getLatestProductPrice(productId);
  if (bidPrice < latestPrice + MIN_BID_DIFF) {
    return false;
  }
  return true;
}

export function addBid(bid: Bid) {
  addBidToData(bid);
}

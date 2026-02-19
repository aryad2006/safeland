import {
    BuyerFunded,
    DealCancelled,
    DealCompleted,
    DealCreated,
    NotaryValidated,
    SellerSigned,
} from "../../generated/SafeLandEscrow/SafeLandEscrow";
import { EscrowDeal } from "../../generated/schema";
import { bigIntToId, getOrCreateGlobalStat } from "../helpers";

export function handleDealCreated(event: DealCreated): void {
  let id = bigIntToId(event.params.dealId);
  let deal = new EscrowDeal(id);
  deal.property = bigIntToId(event.params.tokenId);
  deal.tokenId = event.params.tokenId;
  deal.seller = event.params.seller;
  deal.buyer = event.params.buyer;
  deal.price = event.params.price;
  deal.status = "Created";
  deal.createdAt = event.block.timestamp;
  deal.txHash = event.transaction.hash;
  deal.save();

  let stat = getOrCreateGlobalStat();
  stat.totalEscrowDeals += 1;
  stat.save();
}

export function handleSellerSigned(event: SellerSigned): void {
  let id = bigIntToId(event.params.dealId);
  let deal = EscrowDeal.load(id);
  if (deal != null) {
    deal.status = "SellerSigned";
    deal.save();
  }
}

export function handleBuyerFunded(event: BuyerFunded): void {
  let id = bigIntToId(event.params.dealId);
  let deal = EscrowDeal.load(id);
  if (deal != null) {
    deal.status = "BuyerFunded";
    deal.save();
  }
}

export function handleNotaryValidated(event: NotaryValidated): void {
  let id = bigIntToId(event.params.dealId);
  let deal = EscrowDeal.load(id);
  if (deal != null) {
    deal.status = "NotarySigned";
    deal.save();
  }
}

export function handleDealCompleted(event: DealCompleted): void {
  let id = bigIntToId(event.params.dealId);
  let deal = EscrowDeal.load(id);
  if (deal != null) {
    deal.status = "Completed";
    deal.dgiAmount = event.params.dgiAmount;
    deal.ancfccAmount = event.params.ancfccAmount;
    deal.sellerNet = event.params.sellerNet;
    deal.completedAt = event.block.timestamp;
    deal.save();
  }
}

export function handleDealCancelled(event: DealCancelled): void {
  let id = bigIntToId(event.params.dealId);
  let deal = EscrowDeal.load(id);
  if (deal != null) {
    deal.status = "Cancelled";
    deal.cancelReason = event.params.reason;
    deal.cancelledAt = event.block.timestamp;
    deal.save();
  }
}

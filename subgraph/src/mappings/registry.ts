import {
    FraudPrevented,
    PropertyRegistered,
    TransactionRecorded,
} from "../../generated/SafeLandRegistry/SafeLandRegistry";
import { FraudAlert, RegistryEntry, RegistryTransaction } from "../../generated/schema";
import { bigIntToId, eventId, getOrCreateGlobalStat } from "../helpers";

export function handlePropertyRegistered(event: PropertyRegistered): void {
  let id = bigIntToId(event.params.tokenId);
  let entry = new RegistryEntry(id);
  entry.tokenId = event.params.tokenId;
  entry.city = event.params.city;
  entry.propertyType = event.params.propertyType;
  entry.owner = event.params.owner;
  entry.registeredAt = event.block.timestamp;
  entry.save();
}

export function handleTransactionRecorded(event: TransactionRecorded): void {
  let id = eventId(event.transaction.hash, event.logIndex);
  let tx = new RegistryTransaction(id);
  tx.tokenId = event.params.tokenId;
  tx.from = event.params.from;
  tx.to = event.params.to;
  tx.txType = event.params.txType;
  tx.timestamp = event.block.timestamp;
  tx.txHash = event.transaction.hash;
  tx.save();
}

export function handleFraudPrevented(event: FraudPrevented): void {
  let id = eventId(event.transaction.hash, event.logIndex);
  let alert = new FraudAlert(id);
  alert.tokenId = event.params.tokenId;
  alert.reason = event.params.reason;
  alert.timestamp = event.block.timestamp;
  alert.txHash = event.transaction.hash;
  alert.save();

  let stat = getOrCreateGlobalStat();
  stat.totalFraudAlerts += 1;
  stat.save();
}

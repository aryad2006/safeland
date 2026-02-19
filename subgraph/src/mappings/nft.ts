import {
    EncumbranceAdded,
    EncumbranceRemoved,
    PropertyBurned,
    PropertyCreated,
    PropertyFrozenByJustice,
    PropertyTransferred,
    TransferLocked,
    TransferUnlocked,
} from "../../generated/SafeLandNFT/SafeLandNFT";
import { Encumbrance, Property, PropertyTransfer } from "../../generated/schema";
import { bigIntToId, eventId, getOrCreateGlobalStat } from "../helpers";

export function handlePropertyCreated(event: PropertyCreated): void {
  let id = bigIntToId(event.params.tokenId);
  let property = new Property(id);
  property.titreFoncier = event.params.titreFoncier;
  property.owner = event.params.owner;
  property.validator = event.params.validator;
  property.frozen = false;
  property.locked = false;
  property.burned = false;
  property.createdAt = event.block.timestamp;
  property.createdTx = event.transaction.hash;
  property.save();

  let stat = getOrCreateGlobalStat();
  stat.totalProperties += 1;
  stat.save();
}

export function handlePropertyTransferred(event: PropertyTransferred): void {
  let id = bigIntToId(event.params.tokenId);
  let property = Property.load(id);
  if (property != null) {
    property.owner = event.params.to;
    property.save();
  }

  let transferId = eventId(event.transaction.hash, event.logIndex);
  let transfer = new PropertyTransfer(transferId);
  transfer.property = id;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.txType = event.params.txType;
  transfer.timestamp = event.block.timestamp;
  transfer.txHash = event.transaction.hash;
  transfer.save();

  let stat = getOrCreateGlobalStat();
  stat.totalTransfers += 1;
  stat.save();
}

export function handleEncumbranceAdded(event: EncumbranceAdded): void {
  let tokenId = bigIntToId(event.params.tokenId);
  let stat = getOrCreateGlobalStat();
  let encId = tokenId + "-" + stat.totalEncumbrances.toString();

  let enc = new Encumbrance(encId);
  enc.property = tokenId;
  enc.encType = event.params.encType;
  enc.creditor = event.params.creditor;
  enc.addedAt = event.block.timestamp;
  enc.active = true;
  enc.save();

  stat.totalEncumbrances += 1;
  stat.save();
}

export function handleEncumbranceRemoved(event: EncumbranceRemoved): void {
  let tokenId = bigIntToId(event.params.tokenId);
  let encId = tokenId + "-" + event.params.index.toString();
  let enc = Encumbrance.load(encId);
  if (enc != null) {
    enc.active = false;
    enc.removedAt = event.block.timestamp;
    enc.save();
  }
}

export function handleTransferLocked(event: TransferLocked): void {
  let id = bigIntToId(event.params.tokenId);
  let property = Property.load(id);
  if (property != null) {
    property.locked = true;
    property.lockReason = event.params.reason;
    property.save();
  }
}

export function handleTransferUnlocked(event: TransferUnlocked): void {
  let id = bigIntToId(event.params.tokenId);
  let property = Property.load(id);
  if (property != null) {
    property.locked = false;
    property.lockReason = null;
    property.save();
  }
}

export function handlePropertyFrozen(event: PropertyFrozenByJustice): void {
  let id = bigIntToId(event.params.tokenId);
  let property = Property.load(id);
  if (property != null) {
    property.frozen = true;
    property.judgmentHash = event.params.judgmentHash;
    property.save();
  }
}

export function handlePropertyBurned(event: PropertyBurned): void {
  let id = bigIntToId(event.params.tokenId);
  let property = Property.load(id);
  if (property != null) {
    property.burned = true;
    property.judgmentHash = event.params.judgmentHash;
    property.save();
  }
}

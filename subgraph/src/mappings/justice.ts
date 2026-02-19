import {
    ActionExecuted,
    ActionProposed,
    ActionSigned,
    RecoveryExecuted,
    RecoveryRequested,
} from "../../generated/SafeLandJustice/SafeLandJustice";
import { JusticeAction, JusticeSignature, Recovery } from "../../generated/schema";
import { bigIntToId, getOrCreateGlobalStat } from "../helpers";

const ACTION_TYPES: string[] = ["Freeze", "BurnRemint", "SocialRecovery"];

export function handleActionProposed(event: ActionProposed): void {
  let id = bigIntToId(event.params.actionId);
  let action = new JusticeAction(id);
  action.property = bigIntToId(event.params.tokenId);
  action.actionType = event.params.actionType < 3
    ? ACTION_TYPES[event.params.actionType]
    : "Unknown";
  action.tokenId = event.params.tokenId;
  action.proposedBy = event.params.proposedBy;
  action.executed = false;
  action.totalSignatures = 1; // proposer auto-signs
  action.createdAt = event.block.timestamp;
  action.txHash = event.transaction.hash;
  action.save();

  // Auto-signature du proposeur
  let sigId = id + "-" + event.params.proposedBy.toHexString();
  let sig = new JusticeSignature(sigId);
  sig.action = id;
  sig.signer = event.params.proposedBy;
  sig.signatureIndex = 0;
  sig.timestamp = event.block.timestamp;
  sig.txHash = event.transaction.hash;
  sig.save();

  let stat = getOrCreateGlobalStat();
  stat.totalJusticeActions += 1;
  stat.save();
}

export function handleActionSigned(event: ActionSigned): void {
  let id = bigIntToId(event.params.actionId);
  let action = JusticeAction.load(id);
  if (action != null) {
    action.totalSignatures = event.params.totalSignatures.toI32();
    action.save();
  }

  let sigId = id + "-" + event.params.signer.toHexString();
  let sig = new JusticeSignature(sigId);
  sig.action = id;
  sig.signer = event.params.signer;
  sig.signatureIndex = event.params.totalSignatures.toI32() - 1;
  sig.timestamp = event.block.timestamp;
  sig.txHash = event.transaction.hash;
  sig.save();
}

export function handleActionExecuted(event: ActionExecuted): void {
  let id = bigIntToId(event.params.actionId);
  let action = JusticeAction.load(id);
  if (action != null) {
    action.executed = true;
    action.executedAt = event.block.timestamp;
    action.save();
  }
}

export function handleRecoveryRequested(event: RecoveryRequested): void {
  let id = bigIntToId(event.params.recoveryId);
  let recovery = new Recovery(id);
  recovery.tokenId = event.params.tokenId;
  recovery.currentOwner = event.params.currentOwner;
  recovery.newWallet = event.params.newWallet;
  recovery.executed = false;
  recovery.requestedAt = event.block.timestamp;
  recovery.save();
}

export function handleRecoveryExecuted(event: RecoveryExecuted): void {
  let id = bigIntToId(event.params.recoveryId);
  let recovery = Recovery.load(id);
  if (recovery != null) {
    recovery.executed = true;
    recovery.executedAt = event.block.timestamp;
    recovery.save();
  }
}

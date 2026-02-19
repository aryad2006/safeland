import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { GlobalStat } from "../../generated/schema";

export const GLOBAL_STAT_ID = "global";

export function getOrCreateGlobalStat(): GlobalStat {
  let stat = GlobalStat.load(GLOBAL_STAT_ID);
  if (stat == null) {
    stat = new GlobalStat(GLOBAL_STAT_ID);
    stat.totalProperties = 0;
    stat.totalTransfers = 0;
    stat.totalEncumbrances = 0;
    stat.totalEscrowDeals = 0;
    stat.totalSuccessions = 0;
    stat.totalJusticeActions = 0;
    stat.totalFraudAlerts = 0;
    stat.save();
  }
  return stat as GlobalStat;
}

export function bigIntToId(value: BigInt): string {
  return value.toString();
}

export function eventId(txHash: Bytes, logIndex: BigInt): string {
  return txHash.toHexString() + "-" + logIndex.toString();
}

import {
  OperationScheduled,
  OperationExecuted,
  OperationCancelled,
} from "../../generated/SafeLandTimelock/SafeLandTimelock";
import { TimelockOperation } from "../../generated/schema";
import { getOrCreateGlobalStat } from "../helpers";

export function handleOperationScheduled(event: OperationScheduled): void {
  let id = event.params.operationId.toHexString();

  // Créer ou mettre à jour (idempotent en cas de ré-indexation)
  let op = new TimelockOperation(id);
  op.target = event.params.target;
  op.value = event.params.value;
  op.description = event.params.description;
  op.readyTimestamp = event.params.readyTimestamp;
  op.status = "Pending";
  op.proposer = event.transaction.from;
  op.scheduledAt = event.block.timestamp;
  op.scheduledTx = event.transaction.hash;
  op.save();

  let stat = getOrCreateGlobalStat();
  stat.totalTimelockOps += 1;
  stat.save();
}

export function handleOperationExecuted(event: OperationExecuted): void {
  let id = event.params.operationId.toHexString();
  let op = TimelockOperation.load(id);
  if (op != null) {
    op.status = "Executed";
    op.executedAt = event.block.timestamp;
    op.executedTx = event.transaction.hash;
    op.save();
  }
}

export function handleOperationCancelled(event: OperationCancelled): void {
  let id = event.params.operationId.toHexString();
  let op = TimelockOperation.load(id);
  if (op != null) {
    op.status = "Cancelled";
    op.cancelledAt = event.block.timestamp;
    op.cancelledTx = event.transaction.hash;
    op.save();
  }
}

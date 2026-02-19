import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
    ProposalCreated,
    ProposalExecuted,
    SharesDistributed,
    SuccessionFinalized,
    SuccessionOpened,
    VoteCast,
} from "../../generated/SafeLandFridda/SafeLandFridda";
import { SuccessionDossier, SuccessionProposal, Vote } from "../../generated/schema";
import { bigIntToId, getOrCreateGlobalStat } from "../helpers";

const VOTE_TYPES: string[] = ["Sell", "Rent", "Renovate"];

export function handleSuccessionOpened(event: SuccessionOpened): void {
  let id = bigIntToId(event.params.dossierId);
  let dossier = new SuccessionDossier(id);
  dossier.property = bigIntToId(event.params.nftTokenId);
  dossier.nftTokenId = event.params.nftTokenId;
  dossier.deceased = event.params.deceased;
  dossier.finalized = false;
  dossier.openedAt = event.block.timestamp;
  dossier.txHash = event.transaction.hash;
  dossier.save();

  let stat = getOrCreateGlobalStat();
  stat.totalSuccessions += 1;
  stat.save();
}

export function handleSharesDistributed(event: SharesDistributed): void {
  let id = bigIntToId(event.params.dossierId);
  let dossier = SuccessionDossier.load(id);
  if (dossier != null) {
    let heirs: Bytes[] = [];
    let shares: BigInt[] = [];
    for (let i = 0; i < event.params.heirs.length; i++) {
      heirs.push(event.params.heirs[i]);
      shares.push(event.params.shares[i]);
    }
    dossier.heirs = heirs;
    dossier.shares = shares;
    dossier.save();
  }
}

export function handleSuccessionFinalized(event: SuccessionFinalized): void {
  let id = bigIntToId(event.params.dossierId);
  let dossier = SuccessionDossier.load(id);
  if (dossier != null) {
    dossier.finalized = true;
    dossier.finalizedAt = event.block.timestamp;
    dossier.save();
  }
}

export function handleProposalCreated(event: ProposalCreated): void {
  let id = bigIntToId(event.params.proposalId);
  let proposal = new SuccessionProposal(id);
  proposal.dossier = bigIntToId(event.params.dossierId);

  let voteTypeIndex = event.params.voteType;
  proposal.voteType = voteTypeIndex < 3 ? VOTE_TYPES[voteTypeIndex] : "Unknown";

  proposal.executed = false;
  proposal.createdAt = event.block.timestamp;
  proposal.txHash = event.transaction.hash;
  proposal.save();
}

export function handleVoteCast(event: VoteCast): void {
  let id = bigIntToId(event.params.proposalId) + "-" + event.params.voter.toHexString();
  let vote = new Vote(id);
  vote.proposal = bigIntToId(event.params.proposalId);
  vote.voter = event.params.voter;
  vote.inFavor = event.params.inFavor;
  vote.weight = event.params.weight;
  vote.timestamp = event.block.timestamp;
  vote.txHash = event.transaction.hash;
  vote.save();
}

export function handleProposalExecuted(event: ProposalExecuted): void {
  let id = bigIntToId(event.params.proposalId);
  let proposal = SuccessionProposal.load(id);
  if (proposal != null) {
    proposal.executed = true;
    proposal.executedAt = event.block.timestamp;
    proposal.save();
  }
}

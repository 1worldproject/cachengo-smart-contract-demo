export interface Party {
  id: string;
  role: "Party A" | "Party B" | "Sub-Party";
  displayName?: string;
  legalName?: string;
  wallet?: string;
  email?: string;
  splitPct?: number;
  parentId?: string | null;
}

export interface Milestone {
  id: string;
  label: string;
  amount: number;
  dueDate?: string;
  conditions?: string;
}

export interface ContractDraft {
  metadata: {
    title: string;
    description: string;
    effectiveDate?: string;
    endDate?: string;
    governingLaw?: string;
    arbitrationVenue?: string;
    autoRenew?: boolean;
  };
  payments: {
    currency: string;
    chain: string;
    tokenAddress?: string;
    totalValue?: number;
    milestones: Milestone[];
  };
  parties: Party[];
  terms: {
    confidentiality?: boolean;
    ipOwnership?: "Retained by A" | "Retained by B" | "Assigned" | "Joint";
    termination?: string;
    lateFees?: string;
  };
  signatures: {
    requireEIP712?: boolean;
    signers?: string[];
  };
}

export const CHAINS = [
  { id: "ethereum", label: "Ethereum" },
  { id: "base", label: "Base" },
  { id: "polygon", label: "Polygon" },
  { id: "solana", label: "Solana" },
  { id: "bitcoin", label: "Bitcoin (L2/PSBT)" }
];

export const CURRENCIES = ["USDC", "USDT", "ETH", "MATIC", "BTC", "EUR", "USD", "GBP"];

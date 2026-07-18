export interface ParameterSettings {
  initialInvestment: number;
  monthlyContribution: number;
  horizonYears: number;
}

export type AssetType = 'POST-FIXED' | 'HYBRID' | 'TAX-FREE' | 'FIXED';

export interface AssetTemplate {
  id: string;
  name: string;
  fullName: string;
  type: AssetType;
  rateLabel: string;
  benchmark: 'CDI' | 'SELIC' | 'IPCA' | 'FIX';
  percentageOfBenchmark: number; // e.g. 110 for 110% CDI, 100 for Tesouro Selic, etc.
  additionalSpread: number; // e.g. 6.2 for IPCA + 6.2%
  isTaxExempt: boolean;
  color: string;
  description: string;
}

export interface AssetSimulationResult {
  templateId: string;
  name: string;
  fullName: string;
  type: AssetType;
  isTaxExempt: boolean;
  color: string;
  description: string;
  yearlyBalances: number[]; // Array of size horizonYears + 1
  monthlyBalances: number[]; // Array of size (horizonYears * 12) + 1
  totalContributions: number;
  grossProfit: number;
  estTaxes: number;
  netProfit: number;
  realYieldPa: number;
  finalBalance: number;
}

export interface MarketRate {
  name: string;
  rate: number;
  trend: 'up' | 'down' | 'neutral';
  badge: string;
  description: string;
  colorClass: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isThinking?: boolean;
}

export type TabPage = 'dashboard' | 'comparisons' | 'calculators';

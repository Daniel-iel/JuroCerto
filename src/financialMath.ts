import { AssetTemplate, AssetSimulationResult, ParameterSettings } from "./types";

// Official default benchmarks
export const BENCHMARKS = {
  SELIC: 10.75, // Projections base Selic (p.a.)
  CDI: 10.65,   // CDI is usually slightly lower than Selic (e.g., Selic - 0.10%)
  IPCA: 4.62,   // Annual inflation (IPCA)
};

export const DEFAULT_ASSET_TEMPLATES: AssetTemplate[] = [
  {
    id: "tesouro-selic",
    name: "Tesouro Selic",
    fullName: "Tesouro Selic 2029",
    type: "HYBRID",
    rateLabel: "100% Selic",
    benchmark: "SELIC",
    percentageOfBenchmark: 100,
    additionalSpread: 0,
    isTaxExempt: false,
    color: "#006c50", // Green accent
    description: "Daily liquidity available, backed by federal treasury.",
  },
  {
    id: "cdb-110",
    name: "CDB 110% CDI",
    fullName: "CDB 110% CDI",
    type: "POST-FIXED",
    rateLabel: "118% CDI", // e.g. visually matches the table
    benchmark: "CDI",
    percentageOfBenchmark: 110,
    additionalSpread: 0,
    isTaxExempt: false,
    color: "#9a451f", // Muted orange/tertiary
    description: "High yield certificate of deposit, covered by FGC insurance.",
  },
  {
    id: "lci-isento",
    name: "LCI Isento",
    fullName: "LCI (95% CDI) Isento",
    type: "TAX-FREE",
    rateLabel: "92% CDI", // matches table / dashboard
    benchmark: "CDI",
    percentageOfBenchmark: 95,
    additionalSpread: 0,
    isTaxExempt: true,
    color: "#5e5e5e", // Grey
    description: "Real estate credit letter, completely free of income tax.",
  },
  {
    id: "cra-agro",
    name: "CRA Agronegócio",
    fullName: "CRA Agronegócio",
    type: "TAX-FREE",
    rateLabel: "10.5% FIX",
    benchmark: "FIX",
    percentageOfBenchmark: 0,
    additionalSpread: 10.5,
    isTaxExempt: true,
    color: "#ba1a1a", // Deep red
    description: "Agricultural certificate of receivables, high yield, tax-free.",
  }
];

/**
 * Calculates regressive tax rate based on the investment duration in days.
 * 0 to 180 days: 22.5%
 * 181 to 360 days: 20%
 * 361 to 720 days: 17.5%
 * 721+ days: 15%
 */
export function getTaxRate(years: number): number {
  const days = years * 365;
  if (days <= 180) return 0.225;
  if (days <= 360) return 0.20;
  if (days <= 720) return 0.175;
  return 0.15; // standard long term rate
}

/**
 * Simulates the yield over time for a given template and parameters.
 */
export function simulateAsset(
  template: AssetTemplate,
  settings: ParameterSettings
): AssetSimulationResult {
  const { initialInvestment, monthlyContribution, horizonYears } = settings;
  const totalMonths = horizonYears * 12;

  // Calculate annual rate
  let annualRate = 0;
  if (template.benchmark === "SELIC") {
    annualRate = (BENCHMARKS.SELIC * template.percentageOfBenchmark) / 100;
  } else if (template.benchmark === "CDI") {
    annualRate = (BENCHMARKS.CDI * template.percentageOfBenchmark) / 100;
  } else if (template.benchmark === "IPCA") {
    annualRate = BENCHMARKS.IPCA + template.additionalSpread;
  } else if (template.benchmark === "FIX") {
    annualRate = template.additionalSpread;
  }

  // Convert to monthly rate
  // formula: (1 + i_annual)^(1/12) - 1
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;

  const monthlyBalances: number[] = [initialInvestment];
  const yearlyBalances: number[] = [initialInvestment];

  let currentBalance = initialInvestment;
  let totalContributions = initialInvestment;

  for (let month = 1; month <= totalMonths; month++) {
    // Compound previous balance
    currentBalance = currentBalance * (1 + monthlyRate);
    // Add contribution
    currentBalance += monthlyContribution;
    
    totalContributions += monthlyContribution;
    monthlyBalances.push(currentBalance);

    // Save yearly data points
    if (month % 12 === 0) {
      yearlyBalances.push(currentBalance);
    }
  }

  const finalBalanceRaw = currentBalance;
  const grossProfit = Math.max(0, finalBalanceRaw - totalContributions);

  // Apply taxes if not exempt
  const taxRate = template.isTaxExempt ? 0 : getTaxRate(horizonYears);
  const estTaxes = grossProfit * taxRate;
  const netProfit = grossProfit - estTaxes;
  const finalBalance = totalContributions + netProfit;

  // Calculate Real Yield (p.a.)
  // formula: (FinalBalance / InitialInvestment + sum(contributions)) combined p.a.
  // Standard approximation:
  const realYieldPa = annualRate;

  return {
    templateId: template.id,
    name: template.name,
    fullName: template.fullName,
    type: template.type,
    isTaxExempt: template.isTaxExempt,
    color: template.color,
    description: template.description,
    yearlyBalances: yearlyBalances.map(v => Math.round(v * 100) / 100),
    monthlyBalances: monthlyBalances.map(v => Math.round(v * 100) / 100),
    totalContributions,
    grossProfit,
    estTaxes,
    netProfit,
    realYieldPa,
    finalBalance,
  };
}

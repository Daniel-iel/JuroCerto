import { useState } from "react";
import { Calculator, Percent, ShieldCheck, RefreshCw, HelpCircle, ArrowRight } from "lucide-react";

interface CalculatorsTabProps {
  initialCalculator?: string;
}

export default function CalculatorsTab({ initialCalculator = "compound" }: CalculatorsTabProps) {
  const [activeCalc, setActiveCalc] = useState<string>(initialCalculator);

  // Compound state
  const [principal, setPrincipal] = useState(10000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(11.15); // p.a.
  const [years, setYears] = useState(5);
  const [compoundResult, setCompoundResult] = useState<{ total: number; interest: number; contributions: number } | null>(null);

  // Equivalence state
  const [cdbRate, setCdbRate] = useState(110); // % of CDI
  const [cdiRateValue, setCdiRateValue] = useState(11.15); // % p.a.
  const [taxRateValue, setTaxRateValue] = useState(15); // % standard regressive tax
  const [equivalenceResult, setEquivalenceResult] = useState<{ equivalentLci: number; equivalentCdb: number } | null>(null);

  // Inflation state
  const [nominalAmount, setNominalAmount] = useState(50000);
  const [inflationRate, setInflationRate] = useState(4.62); // IPCA % p.a.
  const [inflationYears, setInflationYears] = useState(5);
  const [inflationResult, setInflationResult] = useState<{ realValue: number; loss: number } | null>(null);

  const formatBrl = (val: number): string => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // 1. Compound Math
  const runCompoundSim = () => {
    const totalMonths = years * 12;
    const monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1;
    
    let total = principal;
    let contributions = principal;

    for (let i = 1; i <= totalMonths; i++) {
      total = total * (1 + monthlyRate) + monthly;
      contributions += monthly;
    }

    setCompoundResult({
      total: Math.round(total * 100) / 100,
      interest: Math.round((total - contributions) * 100) / 100,
      contributions,
    });
  };

  // 2. Tax Equivalence Math
  const runEquivalenceSim = () => {
    // Equivalent tax-exempt LCI = CDB yield rate * (1 - taxRate)
    // Example: CDB 110% CDI with 15% tax is equivalent to LCI of 110 * (1 - 0.15) = 93.5% CDI
    const netEquivalentLciPercent = cdbRate * (1 - taxRateValue / 100);
    // CDB equivalent to LCI is LCI / (1 - taxRate)
    const netEquivalentCdbPercent = cdbRate / (1 - taxRateValue / 100);

    setEquivalenceResult({
      equivalentLci: netEquivalentLciPercent,
      equivalentCdb: netEquivalentCdbPercent,
    });
  };

  // 3. Inflation Math
  const runInflationSim = () => {
    // Future value discounted by inflation rate p.a.
    // Real value = Nominal Amount / (1 + inflationRate/100)^years
    const realValue = nominalAmount / Math.pow(1 + inflationRate / 100, inflationYears);
    setInflationResult({
      realValue: Math.round(realValue * 100) / 100,
      loss: Math.round((nominalAmount - realValue) * 100) / 100,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      {/* Side menu selection (4 cols) */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-brand-primary" />
          <h2 className="font-display text-lg font-bold text-slate-800">Calculators</h2>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Simulate standard financial equivalence models and interest compounding formulas.
        </p>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => setActiveCalc("compound")}
            className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${
              activeCalc === "compound"
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/10"
                : "bg-slate-50 text-slate-700 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Compound Interest</span>
          </button>

          <button
            onClick={() => setActiveCalc("equivalence")}
            className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${
              activeCalc === "equivalence"
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/10"
                : "bg-slate-50 text-slate-700 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>CDB vs LCI/LCA Tax Equivalent</span>
          </button>

          <button
            onClick={() => setActiveCalc("inflation")}
            className={`w-full py-3 px-4 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-3 ${
              activeCalc === "inflation"
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/10"
                : "bg-slate-50 text-slate-700 border border-slate-100 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Inflation Adjustment (IPCA)</span>
          </button>
        </div>
      </div>

      {/* Main math tool layout (8 cols) */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col min-h-[460px]">
        
        {/* 1. COMPOUND INTEREST TOOL */}
        {activeCalc === "compound" && (
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              Compound Interest Simulator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Initial Principal (R$)
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Monthly Contribution (R$)
                </label>
                <input
                  type="number"
                  value={monthly}
                  onChange={(e) => setMonthly(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Annual Yield Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Horizon Period (Years)
                </label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
            </div>

            <button
              onClick={runCompoundSim}
              className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-[0.99]"
            >
              Calculate Compounding Yield
            </button>

            {compoundResult && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3 animate-fade-in">
                <h4 className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Simulation Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-center">
                  <div className="p-3 bg-white rounded-lg border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Contributions</span>
                    <p className="text-sm font-bold text-slate-800 mt-1">{formatBrl(compoundResult.contributions)}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-100">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Yield Earnings</span>
                    <p className="text-sm font-bold text-emerald-600 mt-1">{formatBrl(compoundResult.interest)}</p>
                  </div>
                  <div className="p-3 bg-emerald-500 text-white rounded-lg border border-emerald-600">
                    <span className="text-[9px] font-bold opacity-80 uppercase">Accumulated Total</span>
                    <p className="text-base font-bold mt-1">{formatBrl(compoundResult.total)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. EQUIVALENCE TOOL */}
        {activeCalc === "equivalence" && (
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              CDB vs LCI/LCA Tax Equivalence Calculator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  CDB Rate (% of CDI)
                </label>
                <input
                  type="number"
                  value={cdbRate}
                  onChange={(e) => setCdbRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Base CDI (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cdiRateValue}
                  onChange={(e) => setCdiRateValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Income Tax Rate (%)
                </label>
                <select
                  value={taxRateValue}
                  onChange={(e) => setTaxRateValue(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800"
                >
                  <option value={22.5}>22.5% (Up to 6m)</option>
                  <option value={20}>20.0% (6m to 12m)</option>
                  <option value={17.5}>17.5% (12m to 24m)</option>
                  <option value={15}>15.0% (24m+ / Long term)</option>
                </select>
              </div>
            </div>

            <button
              onClick={runEquivalenceSim}
              className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-[0.99]"
            >
              Analyze Tax Equivalency
            </button>

            {equivalenceResult && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4 animate-fade-in">
                <h4 className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Equivalency Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm">
                  <div className="p-4 bg-white rounded-lg border border-slate-100 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CDB To Tax-Free LCI</span>
                    <p className="text-slate-600 mt-2">
                      A taxable CDB of <span className="font-mono font-bold text-slate-800">{cdbRate}% CDI</span> at a {taxRateValue}% tax rate corresponds to an exempt LCI of:
                    </p>
                    <p className="font-mono text-xl font-extrabold text-emerald-600 mt-3">
                      {equivalenceResult.equivalentLci.toFixed(2)}% CDI
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-slate-100 flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LCI To Taxable CDB</span>
                    <p className="text-slate-600 mt-2">
                      An exempt LCI yield of <span className="font-mono font-bold text-slate-800">{cdbRate}% CDI</span> requires a taxable CDB yield of:
                    </p>
                    <p className="font-mono text-xl font-extrabold text-brand-primary mt-3">
                      {equivalenceResult.equivalentCdb.toFixed(2)}% CDI
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. INFLATION TOOL */}
        {activeCalc === "inflation" && (
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-slate-800 border-b border-slate-100 pb-2">
              Inflation Adjustment Simulator (IPCA)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Nominal Capital Amount (R$)
                </label>
                <input
                  type="number"
                  value={nominalAmount}
                  onChange={(e) => setNominalAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Projected IPCA Rate (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
              <div>
                <label className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  value={inflationYears}
                  onChange={(e) => setInflationYears(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 font-mono"
                />
              </div>
            </div>

            <button
              onClick={runInflationSim}
              className="w-full py-2.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-[0.99]"
            >
              Run Purchasing Power Discount
            </button>

            {inflationResult && (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-3 animate-fade-in">
                <h4 className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Inflation Adjusted Outcomes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-center">
                  <div className="p-4 bg-white rounded-lg border border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Purchasing Power Loss</span>
                    <p className="text-lg font-bold text-rose-600 mt-1">{formatBrl(inflationResult.loss)}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-100">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Real Future Value</span>
                    <p className="text-lg font-bold text-emerald-600 mt-1">{formatBrl(inflationResult.realValue)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

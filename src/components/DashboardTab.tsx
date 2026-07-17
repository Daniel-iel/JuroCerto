import { useState } from "react";
import { TrendingUp, TrendingDown, HelpCircle, CheckCircle, RefreshCw, AlertTriangle, Calculator, Percent, ArrowRight, ShieldCheck } from "lucide-react";
import { TabPage } from "../types";

interface DashboardTabProps {
  onTabChange: (tab: TabPage) => void;
  onSelectCalculator?: (calcName: string) => void;
}

export default function DashboardTab({ onTabChange, onSelectCalculator }: DashboardTabProps) {
  const [projectionPeriod, setProjectionPeriod] = useState<"6m" | "1y">("1y");
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Market rate metrics
  const marketRates = [
    {
      name: "SELIC Rate",
      rate: "11.25%",
      unit: "a.a.",
      trend: "up",
      progressWidth: "85%",
      description: "Target rate set by BCB (Central Bank)",
      colorClass: "text-emerald-500 bg-emerald-500",
      trendIcon: TrendingUp,
    },
    {
      name: "IPCA (Inflation)",
      rate: "4.62%",
      unit: "LTM",
      trend: "up",
      progressWidth: "45%",
      description: "Consumer price index (IBGE), last 12 months",
      colorClass: "text-rose-500 bg-rose-500",
      trendIcon: TrendingUp,
    },
    {
      name: "CDI Rate",
      rate: "11.15%",
      unit: "a.a.",
      trend: "neutral",
      progressWidth: "82%",
      description: "Interbank benchmark rate, daily average",
      colorClass: "text-slate-500 bg-brand-primary",
      trendIcon: HelpCircle,
    },
  ];

  // Saved comparisons data
  const savedComparisons = [
    {
      name: "CDB Banco Master",
      type: "POST-FIXED",
      badgeClass: "bg-slate-100 text-slate-800",
      projYield: "118% CDI",
      netReturn: "R$ 1.240,45",
      status: "success",
      statusIcon: CheckCircle,
      statusColor: "text-emerald-500",
    },
    {
      name: "Tesouro IPCA+ 2029",
      type: "HYBRID",
      badgeClass: "bg-orange-100 text-orange-800",
      projYield: "IPCA + 6.2%",
      netReturn: "R$ 1.092,30",
      status: "updating",
      statusIcon: RefreshCw,
      statusColor: "text-slate-400 animate-spin-slow",
    },
    {
      name: "LCI Imobiliário Itaú",
      type: "TAX-FREE",
      badgeClass: "bg-emerald-100 text-emerald-800",
      projYield: "92% CDI",
      netReturn: "R$ 1.150,00",
      status: "success",
      statusIcon: CheckCircle,
      statusColor: "text-emerald-500",
    },
    {
      name: "CRA Agronegócio",
      type: "TAX-FREE",
      badgeClass: "bg-emerald-100 text-emerald-800",
      projYield: "10.5% FIX",
      netReturn: "R$ 1.050,00",
      status: "warning",
      statusIcon: AlertTriangle,
      statusColor: "text-rose-500",
    },
  ];

  // Bar chart simulation data (for 12 months)
  const projectionMonths = [
    { label: "Aug", value: 10250, percent: "35%" },
    { label: "Sep", value: 10510, percent: "42%" },
    { label: "Oct", value: 10780, percent: "50%" },
    { label: "Nov", value: 11060, percent: "58%" },
    { label: "Dec", value: 11350, percent: "67%" },
    { label: "Jan", value: 11650, percent: "75%" },
    { label: "Feb", value: 11960, percent: "82%" },
    { label: "Mar", value: 12280, percent: "88%" },
    { label: "Apr", value: 12610, percent: "92%" },
    { label: "May", value: 12950, percent: "95%" },
    { label: "Jun", value: 13300, percent: "98%" },
    { label: "Jul", value: 13660, percent: "100%", isMax: true },
  ];

  const currentProjectionData = projectionPeriod === "6m" 
    ? projectionMonths.slice(0, 6) 
    : projectionMonths;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Section 1: Market Rates Summary */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Market Pulse</h2>
            <p className="text-sm text-slate-500 mt-0.5">Primary macroeconomic indicators used for Brazilian fixed-income calculations.</p>
          </div>
          <span className="font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">
            Updated: Today, 09:00 AM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketRates.map((rate, idx) => {
            const Icon = rate.trendIcon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col gap-3 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <span className="font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {rate.name}
                  </span>
                  <Icon className={`w-4 h-4 ${rate.trend === "up" ? "text-emerald-500" : "text-slate-400"}`} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-slate-900">{rate.rate}</span>
                  <span className="font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {rate.unit}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${rate.colorClass === "text-rose-500 bg-rose-500" ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: rate.progressWidth }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{rate.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Bento Grid for Comparison & Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Saved Comparisons (Main Bento Tile) */}
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Saved Yield Comparisons</h3>
              <p className="text-xs text-slate-500 mt-0.5">Quick lookup of your simulated scenarios.</p>
            </div>
            <button
              onClick={() => onTabChange("comparisons")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
            >
              New Comparison
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Name</th>
                  <th className="p-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">Yield Type</th>
                  <th className="p-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Proj. Yield</th>
                  <th className="p-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Net Return</th>
                  <th className="p-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedComparisons.map((row, idx) => {
                  const StatusIcon = row.statusIcon;
                  return (
                    <tr 
                      key={idx} 
                      onClick={() => onTabChange("comparisons")}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-sans text-sm font-bold text-slate-800 group-hover:text-brand-primary">
                        {row.name}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.badgeClass}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm text-right text-emerald-600 font-semibold">
                        {row.projYield}
                      </td>
                      <td className="p-4 font-mono text-sm text-right font-medium text-slate-700">
                        {row.netReturn}
                      </td>
                      <td className="p-4 text-center flex justify-center">
                        <StatusIcon className={`w-5 h-5 ${row.statusColor}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-white border-t border-slate-100 mt-auto flex justify-center">
            <button
              onClick={() => onTabChange("comparisons")}
              className="font-sans text-xs font-bold text-brand-primary hover:text-emerald-700 transition-all uppercase tracking-widest flex items-center gap-1 cursor-pointer"
            >
              View All Comparisons
            </button>
          </div>
        </section>

        {/* Quick Tools (Vertical Column Tiles) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Calculator Card 1: Compound Interest */}
          <div 
            onClick={() => {
              if (onSelectCalculator) onSelectCalculator("compound");
              onTabChange("calculators");
            }}
            className="bg-brand-primary text-white p-6 rounded-xl relative overflow-hidden flex flex-col gap-2 group cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="z-10 flex flex-col gap-2">
              <Calculator className="w-8 h-8 text-emerald-300" />
              <h4 className="font-display text-lg font-bold">Compound Interest</h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed">Simulate long-term wealth growth with compound monthly contributions.</p>
            </div>
            <div className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-32 h-32" />
            </div>
          </div>

          {/* Calculator Card 2: CDB vs LCI/LCA */}
          <div 
            onClick={() => {
              if (onSelectCalculator) onSelectCalculator("equivalence");
              onTabChange("calculators");
            }}
            className="bg-white border border-slate-200 hover:border-brand-primary p-6 rounded-xl flex flex-col gap-2 group cursor-pointer transition-all hover:shadow-md"
          >
            <Percent className="w-8 h-8 text-emerald-600" />
            <h4 className="font-display text-base font-bold text-slate-900 group-hover:text-brand-primary">CDB vs LCI/LCA</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Calculate the gross CDI equivalent rate required to match a tax-free investment.</p>
            <div className="mt-2 flex items-center gap-1 text-emerald-600 font-sans text-xs font-bold uppercase tracking-wider">
              Launch Calculator <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Calculator Card 3: Inflation Adjustment */}
          <div 
            onClick={() => {
              if (onSelectCalculator) onSelectCalculator("inflation");
              onTabChange("calculators");
            }}
            className="bg-finance-dark text-white p-6 rounded-xl flex flex-col gap-2 group cursor-pointer hover:bg-slate-900 transition-all shadow-sm"
          >
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h4 className="font-display text-base font-bold">Inflation Adjustment</h4>
            <p className="text-xs text-slate-300 leading-relaxed">See the real purchasing power of your yields over time relative to IPCA.</p>
          </div>
        </div>
      </div>

      {/* Section 3: Yield Projection Visualizer */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">Yield Projection</h3>
            <p className="text-xs text-slate-500 mt-0.5">Projected net return for the next 12 months based on your top saved comparisons.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200/50 self-end md:self-auto">
            <button 
              onClick={() => setProjectionPeriod("6m")}
              className={`px-4 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${projectionPeriod === "6m" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              6 Months
            </button>
            <button 
              onClick={() => setProjectionPeriod("1y")}
              className={`px-4 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${projectionPeriod === "1y" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              1 Year
            </button>
          </div>
        </div>

        {/* Custom interactive bars visualizer */}
        <div className="w-full h-64 bg-slate-50 rounded-xl relative flex items-end px-4 md:px-8 gap-3 md:gap-4 overflow-visible border border-slate-100">
          
          {currentProjectionData.map((bar, idx) => {
            const isHovered = hoveredBarIndex === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
                className={`flex-1 transition-all duration-300 rounded-t-lg relative group cursor-pointer ${
                  bar.isMax 
                    ? "bg-brand-primary" 
                    : "bg-emerald-500/20 hover:bg-emerald-500/40"
                }`}
                style={{ height: bar.percent }}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-finance-dark text-white px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono whitespace-nowrap shadow-md z-10 flex flex-col items-center">
                    <span>R$ {bar.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">{bar.label}</span>
                  </div>
                )}
                
                {/* Fixed Label underneath */}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] font-bold text-slate-400 group-hover:text-slate-800 transition-colors uppercase">
                  {bar.label}
                </span>

                {bar.isMax && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-finance-dark text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">
                    Max Yield
                  </div>
                )}
              </div>
            );
          })}

          {/* Grid lines inside chart */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-6 py-8 opacity-5">
            <div className="border-t border-slate-800 w-full"></div>
            <div className="border-t border-slate-800 w-full"></div>
            <div className="border-t border-slate-800 w-full"></div>
            <div className="border-t border-slate-800 w-full"></div>
          </div>
        </div>
        <div className="h-6"></div> {/* spacer for fixed labels */}
      </section>
    </div>
  );
}

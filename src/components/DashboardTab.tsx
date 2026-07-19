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
      name: "Taxa SELIC",
      rate: "11.25%",
      unit: "a.a.",
      trend: "up",
      progressWidth: "85%",
      description: "Taxa alvo definida pelo BCB (Banco Central)",
      colorClass: "text-primary bg-primary",
      trendIcon: TrendingUp,
    },
    {
      name: "IPCA (Inflação)",
      rate: "4.62%",
      unit: "LTM",
      trend: "up",
      progressWidth: "45%",
      description: "Índice de preços ao consumidor (IBGE), últimos 12 meses",
      colorClass: "text-error bg-error",
      trendIcon: TrendingUp,
    },
    {
      name: "Taxa CDI",
      rate: "11.15%",
      unit: "a.a.",
      trend: "neutral",
      progressWidth: "82%",
      description: "Taxa de referência interbancária, média diária",
      colorClass: "text-on-surface-variant bg-primary",
      trendIcon: HelpCircle,
    },
  ];

  // Saved comparisons data
  const savedComparisons = [
    {
      name: "CDB Banco Master",
      type: "POST-FIXED",
      badgeClass: "bg-surface-container-high text-on-surface",
      projYield: "118% CDI",
      netReturn: "R$ 1.240,45",
      status: "success",
      statusIcon: CheckCircle,
      statusColor: "text-primary",
    },
    {
      name: "Tesouro IPCA+ 2029",
      type: "HYBRID",
      badgeClass: "bg-surface-container-high text-on-surface",
      projYield: "IPCA + 6.2%",
      netReturn: "R$ 1.092,30",
      status: "updating",
      statusIcon: RefreshCw,
      statusColor: "text-on-surface-variant animate-spin-slow",
    },
    {
      name: "LCI Imobiliário Itaú",
      type: "TAX-FREE",
      badgeClass: "bg-surface-container-high text-on-surface",
      projYield: "92% CDI",
      netReturn: "R$ 1.150,00",
      status: "success",
      statusIcon: CheckCircle,
      statusColor: "text-primary",
    },
    {
      name: "CRA Agronegócio",
      type: "TAX-FREE",
      badgeClass: "bg-surface-container-high text-on-surface",
      projYield: "10.5% FIX",
      netReturn: "R$ 1.050,00",
      status: "warning",
      statusIcon: AlertTriangle,
      statusColor: "text-error",
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
            <h1 className="font-display text-2xl font-bold text-on-surface">Pulso de Mercado</h1>
            <p className="text-sm text-on-surface-variant mt-0.5">Indicadores macroeconômicos primários usados para cálculos de renda fixa brasileira.</p>
          </div>
          <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Atualizado: Hoje, 09:00 AM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketRates.map((rate, idx) => {
            const Icon = rate.trendIcon;
            return (
              <div
                key={idx}
                className="bg-surface-card border border-outline-variant p-6 rounded-xl flex flex-col gap-3 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {rate.name}
                  </span>
                  <Icon className={`w-4 h-4 ${rate.trend === "up" ? "text-primary" : "text-on-surface-variant"}`} />
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-on-surface">{rate.rate}</span>
                  <span className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                    {rate.unit}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full ${rate.colorClass === "text-error bg-error" ? "bg-error" : "bg-primary"}`} style={{ width: rate.progressWidth }}></div>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">{rate.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Bento Grid for Comparison & Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Saved Comparisons (Main Bento Tile) */}
        <section className="lg:col-span-8 bg-surface-card border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container/50">
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">Comparações de Rendimento Salvas</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Consulta rápida de seus cenários simulados.</p>
            </div>
            <button
              onClick={() => onTabChange("comparisons")}
              className="bg-primary hover:bg-primary text-on-primary px-4 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
            >
              Nova Comparação
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container border-b border-outline-variant">
                <tr>
                  <th className="p-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nome do Ativo</th>
                  <th className="p-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tipo de Rendimento</th>
                  <th className="p-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Rendimento Proj.</th>
                  <th className="p-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Retorno Líquido</th>
                  <th className="p-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {savedComparisons.map((row, idx) => {
                  const StatusIcon = row.statusIcon;
                  return (
                    <tr 
                      key={idx} 
                      onClick={() => onTabChange("comparisons")}
                      className="hover:bg-surface-container/70 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-sans text-sm font-bold text-on-surface group-hover:text-primary">
                        {row.name}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.badgeClass}`}>
                          {row.type}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm text-right text-primary font-semibold">
                        {row.projYield}
                      </td>
                      <td className="p-4 font-mono text-sm text-right font-medium text-on-surface">
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
          
          <div className="p-4 bg-surface-card border-t border-outline-variant mt-auto flex justify-center">
            <button
              onClick={() => onTabChange("comparisons")}
              className="font-sans text-xs font-bold text-primary hover:text-primary transition-all uppercase tracking-widest flex items-center gap-1 cursor-pointer"
            >
              Ver Todas as Comparações
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
            className="bg-primary text-on-primary p-6 rounded-xl relative overflow-hidden flex flex-col gap-2 group cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="z-10 flex flex-col gap-2">
              <Calculator className="w-8 h-8 text-surface-container-high" />
              <h4 className="font-display text-lg font-bold">Juros Compostos</h4>
              <p className="text-xs text-surface-dim/90 leading-relaxed">Simule crescimento de riqueza a longo prazo com contribuções mensais compostas.</p>
            </div>
            <div className="absolute -bottom-6 -right-6 text-surface-dim/5 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-32 h-32" />
            </div>
          </div>

          {/* Calculator Card 2: CDB vs LCI/LCA */}
          <div 
            onClick={() => {
              if (onSelectCalculator) onSelectCalculator("equivalence");
              onTabChange("calculators");
            }}
            className="bg-surface-card border border-outline-variant hover:border-primary p-6 rounded-xl flex flex-col gap-2 group cursor-pointer transition-all hover:shadow-md"
          >
            <Percent className="w-8 h-8 text-primary" />
            <h4 className="font-display text-base font-bold text-on-surface group-hover:text-primary">CDB vs LCI/LCA</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">Calcule a taxa CDI bruta equivalente necessária para equiparar um investimento isento de impostos.</p>
            <div className="mt-2 flex items-center gap-1 text-primary font-sans text-xs font-bold uppercase tracking-wider">
              Lançar Calculadora <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Calculator Card 3: Inflation Adjustment */}
          <div 
            onClick={() => {
              if (onSelectCalculator) onSelectCalculator("inflation");
              onTabChange("calculators");
            }}
            className="bg-surface-container-high text-on-surface p-6 rounded-xl flex flex-col gap-2 group cursor-pointer hover:bg-surface-container transition-all shadow-sm"
          >
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h4 className="font-display text-base font-bold">Ajuste pela Inflação</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">Veja o poder de compra real de seus rendimentos ao longo do tempo em relação à IPCA.</p>
          </div>
        </div>
      </div>

      {/* Section 3: Yield Projection Visualizer */}
      <section className="bg-surface-card border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-on-surface">Projeção de Rendimento</h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Retorno líquido projetado para os próximos 12 meses com base em suas principais comparações salvas.</p>
          </div>
          <div className="flex bg-surface-container p-1 rounded-lg gap-1 border border-outline-variant/50 self-end md:self-auto">
            <button 
              onClick={() => setProjectionPeriod("6m")}
              className={`px-4 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${projectionPeriod === "6m" ? "bg-surface-card text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              6 Meses
            </button>
            <button 
              onClick={() => setProjectionPeriod("1y")}
              className={`px-4 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase transition-all cursor-pointer ${projectionPeriod === "1y" ? "bg-surface-card text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              1 Ano
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

import { useState, useMemo } from "react";
import { Sliders, Plus, X, Eye, FileSpreadsheet, TrendingUp, HelpCircle, PhoneCall, Info } from "lucide-react";
import { ParameterSettings, AssetTemplate, AssetSimulationResult, TabPage } from "../types";
import { DEFAULT_ASSET_TEMPLATES, simulateAsset } from "../financialMath";

interface ComparisonsTabProps {
  onTabChange: (tab: TabPage) => void;
}

export default function ComparisonsTab({ onTabChange }: ComparisonsTabProps) {
  // Simulator parameters state
  const [settings, setSettings] = useState<ParameterSettings>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    horizonYears: 5,
  });

  // Assets being compared (initially Tesouro Selic, CDB 110% CDI, LCI Isento)
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([
    "tesouro-selic",
    "cdb-110",
    "lci-isento",
  ]);

  // Is "Total Value" or "Net Profit" selected on the chart
  const [chartValueType, setChartValueType] = useState<"total" | "net">("total");

  // Show "Add Asset" selector dropdown / modal
  const [showAddAsset, setShowAddAsset] = useState<boolean>(false);

  // Raw inputs state for formatting/text editing
  const [initialInvestmentRaw, setInitialInvestmentRaw] = useState("10.000,00");
  const [monthlyContributionRaw, setMonthlyContributionRaw] = useState("500,00");

  // Format helper to parse Brazilian currency format "10.000,00" to Float
  const parseBrlFloat = (val: string): number => {
    // strip dots, replace comma with dot
    const clean = val.replace(/\./g, "").replace(",", ".");
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Format Float to Brazilian Currency string
  const formatBrl = (val: number): string => {
    return val.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Get active templates
  const activeTemplates = useMemo(() => {
    return DEFAULT_ASSET_TEMPLATES.filter((t) => selectedAssetIds.includes(t.id));
  }, [selectedAssetIds]);

  // Non-compared templates available to add
  const availableTemplates = useMemo(() => {
    return DEFAULT_ASSET_TEMPLATES.filter((t) => !selectedAssetIds.includes(t.id));
  }, [selectedAssetIds]);

  // Run simulation for all active templates
  const simulationResults = useMemo<AssetSimulationResult[]>(() => {
    return activeTemplates.map((template) => simulateAsset(template, settings));
  }, [activeTemplates, settings]);

  // Handle Initial Investment changes
  const handleInitialChange = (val: string) => {
    setInitialInvestmentRaw(val);
    const num = parseBrlFloat(val);
    setSettings((prev) => ({ ...prev, initialInvestment: num }));
  };

  // Handle Monthly Contribution changes
  const handleMonthlyChange = (val: string) => {
    setMonthlyContributionRaw(val);
    const num = parseBrlFloat(val);
    setSettings((prev) => ({ ...prev, monthlyContribution: num }));
  };

  // Remove asset from comparison
  const removeAsset = (id: string) => {
    if (selectedAssetIds.length > 1) {
      setSelectedAssetIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Add asset to comparison
  const addAsset = (id: string) => {
    setSelectedAssetIds((prev) => [...prev, id]);
    setShowAddAsset(false);
  };

  // Dynamic analysis metrics
  const bestReturn = useMemo(() => {
    if (simulationResults.length === 0) return null;
    return [...simulationResults].sort((a, b) => b.finalBalance - a.finalBalance)[0];
  }, [simulationResults]);

  const highestLiquidity = useMemo(() => {
    return simulationResults.find((r) => r.templateId === "tesouro-selic") || simulationResults[0];
  }, [simulationResults]);

  const taxOptimized = useMemo(() => {
    return simulationResults.find((r) => r.isTaxExempt) || simulationResults[0];
  }, [simulationResults]);

  // Interactive hover point on chart
  const [hoveredPoint, setHoveredPoint] = useState<{
    yearIndex: number;
    yearLabel: string;
    clientX: number;
    clientY: number;
    values: { name: string; color: string; val: number }[];
  } | null>(null);

  // SVG Chart Dimensions
  const chartWidth = 550;
  const chartHeight = 240;
  const paddingX = 40;
  const paddingY = 20;

  // Render SVG Chart Lines
  const chartData = useMemo(() => {
    if (simulationResults.length === 0) return { paths: [], points: [], yTicks: [], years: [] };

    const yearsCount = settings.horizonYears;
    const yearsLabels = Array.from({ length: yearsCount + 1 }, (_, i) => `Year ${i}`);

    // Determine max value for Y scaling
    let maxVal = 0;
    simulationResults.forEach((res) => {
      const balances = chartValueType === "total" ? res.yearlyBalances : res.yearlyBalances.map((b, i) => Math.max(0, b - res.totalContributions * (i / yearsCount)));
      maxVal = Math.max(maxVal, ...balances);
    });

    maxVal = maxVal * 1.05; // 5% padding
    if (maxVal <= 0) maxVal = 1000;

    // Generate Y Ticks
    const tickCount = 5;
    const yTicks = Array.from({ length: tickCount }, (_, i) => {
      const val = (maxVal * i) / (tickCount - 1);
      return {
        val,
        y: chartHeight - paddingY - (val / maxVal) * (chartHeight - 2 * paddingY),
      };
    });

    const getX = (yearIdx: number) => {
      return paddingX + (yearIdx / yearsCount) * (chartWidth - 2 * paddingX);
    };

    const getY = (val: number) => {
      return chartHeight - paddingY - (val / maxVal) * (chartHeight - 2 * paddingY);
    };

    const paths = simulationResults.map((res) => {
      const balances = chartValueType === "total" 
        ? res.yearlyBalances 
        : res.yearlyBalances.map((b, i) => {
            // Net profit over contributions at year i
            const contrAtYear = res.totalContributions * (i / yearsCount);
            return Math.max(0, b - contrAtYear);
          });

      const d = balances
        .map((val, idx) => `${idx === 0 ? "M" : "L"}${getX(idx)} ${getY(val)}`)
        .join(" ");

      const points = balances.map((val, idx) => ({
        cx: getX(idx),
        cy: getY(idx === 0 ? 0 : val), // start at base for year 0
        actualCy: getY(val),
        val,
        yearLabel: `Year ${idx}`,
        yearIdx: idx,
      }));

      return {
        templateId: res.templateId,
        color: res.color,
        name: res.name,
        d,
        points,
      };
    });

    return { paths, yTicks, years: yearsLabels };
  }, [simulationResults, chartValueType, settings.horizonYears]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">Comparação de Ativos</h1>
          <p className="text-sm text-on-surface-variant mt-1">Simule e analise projeções de rendimento para múltiplos instrumentos financeiros.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => alert("Relatório de simulação gerado e enviado para o serviço de impressão!")}  
            className="flex-1 md:flex-none px-4 py-2 border border-outline-variant text-on-surface bg-surface-card rounded-lg font-bold hover:bg-surface-container text-xs uppercase tracking-wider transition-all"
          >
            Exportar PDF
          </button>
          <button 
            onClick={() => alert("Cenário de comparação de portfólio salvo em seu painel na nuvem!")}  
            className="flex-1 md:flex-none px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:opacity-90 text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            Salvar Cenário
          </button>
        </div>
      </div>

      {/* Input Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Config/Parameters Card (4 cols) */}
        <div className="lg:col-span-4 bg-surface-card border border-outline-variant rounded-xl p-6 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant">
            <Sliders className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">Parâmetros</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Investimento Inicial
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant font-bold">R$</span>
                <input
                  type="text"
                  value={initialInvestmentRaw}
                  onChange={(e) => handleInitialChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-mono text-sm font-semibold text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Contribuição Mensal
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant font-bold">R$</span>
                <input
                  type="text"
                  value={monthlyContributionRaw}
                  onChange={(e) => handleMonthlyChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all font-mono text-sm font-semibold text-on-surface"
                />
              </div>
            </div>

            <div>
              <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1.5">
                Horizonte (Anos)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={settings.horizonYears}
                  onChange={(e) => setSettings((prev) => ({ ...prev, horizonYears: parseInt(e.target.value) }))}
                  className="flex-grow h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="font-display text-xl font-bold text-primary w-8 text-right">
                  {settings.horizonYears}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant space-y-3">
            <label className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">
              Comparar Ativos
            </label>
            <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
              {simulationResults.map((res) => (
                <div
                  key={res.templateId}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container border border-outline-variant hover:border-primary transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: res.color }}></div>
                    <span className="text-xs font-bold text-on-surface">{res.name}</span>
                  </div>
                  {simulationResults.length > 1 && (
                    <button
                      onClick={() => removeAsset(res.templateId)}
                      className="text-on-surface-variant hover:text-error transition-colors p-0.5 rounded"
                      title="Remove asset"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {availableTemplates.length > 0 ? (
              <div className="relative">
                <button
                  onClick={() => setShowAddAsset(!showAddAsset)}
                  className="w-full py-2 border border-dashed border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary font-sans text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-surface-container transition-all flex items-center justify-center gap-1 cursor-pointer mt-1"
                >
                  <Plus className="w-4 h-4" /> Adicionar Outro Ativo
                </button>
                {showAddAsset && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-surface-card border border-outline-variant rounded-lg shadow-lg overflow-hidden z-10">
                    {availableTemplates.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addAsset(item.id)}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container hover:text-primary border-b border-outline-variant last:border-0 transition-all"
                      >
                        {item.name} ({item.rateLabel})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Chart Card (8 cols) */}
        <div className="lg:col-span-8 bg-surface-card border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm relative">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-on-surface">Projeção de Rendimento</h2>
            </div>
            <div className="flex bg-surface-container p-1 rounded-lg gap-1 border border-outline-variant/50">
              <button
                onClick={() => setChartValueType("total")}
                className={`px-3 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  chartValueType === "total" ? "bg-surface-card text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Valor Total
              </button>
              <button
                onClick={() => setChartValueType("net")}
                className={`px-3 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  chartValueType === "net" ? "bg-surface-card text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Lucro Líquido
              </button>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="flex-grow w-full h-[240px] relative mt-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              {chartData.yTicks.map((tick, idx) => (
                <g key={idx} className="opacity-40">
                  <line
                    x1={paddingX}
                    y1={tick.y}
                    x2={chartWidth - paddingX}
                    y2={tick.y}
                    stroke="#E2E8F0"
                    strokeWidth="1.5"
                    strokeDasharray={idx === 0 ? "0" : "4 4"}
                  />
                  <text
                    x={paddingX - 8}
                    y={tick.y + 4}
                    textAnchor="end"
                    className="font-mono text-[9px] fill-slate-400 font-semibold"
                  >
                    R$ {Math.round(tick.val / 1000)}k
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {chartData.years.map((label, idx) => {
                const x = paddingX + (idx / settings.horizonYears) * (chartWidth - 2 * paddingX);
                return (
                  <text
                    key={idx}
                    x={x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    className="font-sans text-[9px] fill-slate-400 font-bold uppercase"
                  >
                    {idx === 0 ? "Start" : `Yr ${idx}`}
                  </text>
                );
              })}

              {/* Chart Lines */}
              {chartData.paths.map((path) => (
                <path
                  key={path.templateId}
                  d={path.d}
                  fill="none"
                  stroke={path.color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              ))}

              {/* Highlight Nodes */}
              {chartData.paths.map((path) =>
                path.points.map((pt, pIdx) => (
                  <circle
                    key={`${path.templateId}-${pIdx}`}
                    cx={pt.cx}
                    cy={pt.actualCy}
                    r="4.5"
                    fill={path.color}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:scale-150 transition-transform duration-150"
                    onMouseEnter={(e) => {
                      const clientX = e.clientX;
                      const clientY = e.clientY;
                      
                      // Gather values of all assets at this year index
                      const valuesAtYear = chartData.paths.map((p) => ({
                        name: p.name,
                        color: p.color,
                        val: p.points[pIdx].val,
                      }));

                      setHoveredPoint({
                        yearIndex: pIdx,
                        yearLabel: pt.yearLabel,
                        clientX,
                        clientY,
                        values: valuesAtYear,
                      });
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))
              )}
            </svg>

            {/* Custom Interactive Floating Tooltip */}
            {hoveredPoint && (
              <div 
                className="absolute bg-slate-900 text-white rounded-lg p-3 text-xs shadow-xl z-20 space-y-1.5 border border-slate-700/50"
                style={{
                  left: `${Math.min(chartWidth - 160, Math.max(10, (hoveredPoint.yearIndex / settings.horizonYears) * chartWidth - 75))}px`,
                  top: "10px",
                }}
              >
                <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-1">
                  {hoveredPoint.yearLabel}
                </div>
                {hoveredPoint.values.map((v, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-6 font-mono text-[11px]">
                    <div className="flex items-center gap-1.5 font-sans font-semibold">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }}></div>
                      <span className="text-slate-300">{v.name}</span>
                    </div>
                    <span className="font-bold text-emerald-400">{formatBrl(v.val)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 border-t border-slate-50 pt-3">
            {simulationResults.map((res) => (
              <div key={res.templateId} className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: res.color }}></div>
                <span>{res.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Summary Cards */}
      {bestReturn && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Best Overall Return */}
          <div className="bg-white border-l-4 border-l-emerald-500 border border-slate-200 rounded-xl p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-all">
            <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Best Overall Return
            </span>
            <h3 className="font-display text-lg font-bold text-emerald-600">{bestReturn.name}</h3>
            <p className="font-mono text-2xl font-bold text-slate-800">{formatBrl(bestReturn.finalBalance)}</p>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> +{((bestReturn.finalBalance - (settings.initialInvestment + settings.monthlyContribution * settings.horizonYears * 12)) / (settings.initialInvestment + settings.monthlyContribution * settings.horizonYears * 12) * 100).toFixed(1)}% vs Cost
            </p>
          </div>

          {/* Card 2: Highest Liquidity */}
          {highestLiquidity && (
            <div className="bg-white border-l-4 border-l-brand-tertiary border border-slate-200 rounded-xl p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-all">
              <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Highest Liquidity
              </span>
              <h3 className="font-display text-lg font-bold text-brand-tertiary">{highestLiquidity.name}</h3>
              <p className="font-mono text-2xl font-bold text-slate-800">{formatBrl(highestLiquidity.finalBalance)}</p>
              <p className="text-xs text-slate-400 mt-2 font-semibold">
                Daily liquidity &amp; federally backed
              </p>
            </div>
          )}

          {/* Card 3: Tax Optimized */}
          {taxOptimized && (
            <div className="bg-white border-l-4 border-l-slate-400 border border-slate-200 rounded-xl p-5 flex flex-col gap-1 shadow-sm hover:shadow-md transition-all">
              <span className="font-sans text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Tax Optimized
              </span>
              <h3 className="font-display text-lg font-bold text-slate-500">{taxOptimized.name}</h3>
              <p className="font-mono text-2xl font-bold text-slate-800">{formatBrl(taxOptimized.finalBalance)}</p>
              <p className="text-xs text-slate-400 mt-2 font-semibold">
                0% Income Tax applied (LCI exempt)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detailed Analysis Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-brand-primary" />
            <h2 className="font-display text-lg font-bold text-slate-800">Breakdown by Asset</h2>
          </div>
          <div className="text-slate-400 text-xs font-sans font-bold uppercase tracking-wider">
            Projections for {settings.horizonYears * 12} Months
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Class</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Gross Profit</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Est. Taxes</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Net Profit</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Real Yield (PA)</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Final Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {simulationResults.map((res) => (
                <tr key={res.templateId} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: res.color }}></div>
                      <span className="font-sans text-sm font-bold text-slate-800">{res.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600 text-right">
                    {formatBrl(res.grossProfit)}
                  </td>
                  <td className={`px-6 py-4 font-mono text-sm text-right font-semibold ${res.isTaxExempt ? "text-slate-400" : "text-rose-600"}`}>
                    {res.isTaxExempt ? "Isento" : `- ${formatBrl(res.estTaxes)}`}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-emerald-600 font-bold text-right">
                    + {formatBrl(res.netProfit)}
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600 text-right">
                    {res.realYieldPa.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-bold text-slate-800 text-right">
                    {formatBrl(res.finalBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/50 text-slate-400 text-[10px] leading-normal italic flex gap-1.5 items-start border-t border-slate-100">
          <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            * Projections are based on current market rates and the Brazilian regressive income tax table for fixed income (22.5% to 15.0% depending on horizon). LCI/LCA and CRA instruments are completely exempt from Income Tax for individuals. Actual returns may vary depending on macroeconomic fluctuations.
          </span>
        </div>
      </div>

      {/* Call to Action Section (Transitions to AI Advisor Tab) */}
      <section className="relative bg-finance-dark text-white rounded-xl overflow-hidden p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-md">
        <div className="relative z-10 flex-grow text-center md:text-left">
          <h2 className="font-display text-2xl font-bold text-brand-primary-container">Ready to optimize?</h2>
          <p className="font-sans text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            Our expert AI advisors can help you structure this portfolio, recommend specific issues, and implement automated rebalancing and tax-loss harvesting features.
          </p>
        </div>
        <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
          <button
            className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            disabled
          >
            <PhoneCall className="w-4 h-4" /> Speak to an Advisor
          </button>
        </div>
      </section>
    </div>
  );
}

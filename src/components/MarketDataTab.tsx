import { TrendingUp, RefreshCw, Layers, ShieldCheck, DollarSign, Award, ChevronRight } from "lucide-react";

export default function MarketDataTab() {
  const benchmarks = [
    { name: "Selic Meta", rate: "11.25%", ppa: "11.25% a.a.", change: "0.00%", update: "Taxa Alvo", desc: "Taxa de juros oficial definida pelo COPOM.", icon: Award },
    { name: "CDI Acumulado", rate: "11.15%", ppa: "11.15% a.a.", change: "-0.05%", update: "Média de Mercado", desc: "Taxa de depósito interbancário compilada diariamente pela B3.", icon: TrendingUp },
    { name: "IPCA (IBGE)", rate: "4.62%", ppa: "4.62% Últimos 12m", change: "+0.12%", update: "Inflação", desc: "Índice amplo de preços ao consumidor medindo inflação.", icon: Layers },
    { name: "TR (Taxa Referencial)", rate: "1.79%", ppa: "1.79% a.a.", change: "+0.02%", update: "Taxa de Referência", desc: "Usada para financiamento imobiliário e índices de poupança.", icon: DollarSign },
  ];

  const treasuryBonds = [
    { code: "Tesouro Selic 2026", rate: "Selic + 0,04%", minInvestment: "R$ 143,20", type: "Pós-fixado", maturity: "01/03/2026" },
    { code: "Tesouro Selic 2029", rate: "Selic + 0,15%", minInvestment: "R$ 141,50", type: "Pós-fixado", maturity: "01/03/2029" },
    { code: "Tesouro IPCA+ 2029", rate: "IPCA + 6,18%", minInvestment: "R$ 3.120,40", type: "Híbrido", maturity: "15/05/2029" },
    { code: "Tesouro IPCA+ 2035", rate: "IPCA + 6,22%", minInvestment: "R$ 2.450,10", type: "Híbrido", maturity: "15/05/2035" },
    { code: "Tesouro Prefixado 2027", rate: "10,45% PREFIXADO", minInvestment: "R$ 750,00", type: "Prefixado", maturity: "01/01/2027" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-on-surface tracking-tight">Indicadores de Mercado</h1>
        <p className="text-sm text-on-surface-variant mt-1">Taxas de renda fixa em tempo real e índices de referência macroeconômicos oficiais.</p>
      </div>

      {/* Benchmark Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benchmarks.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="bg-surface-card border border-outline-variant p-5 rounded-xl flex flex-col gap-2.5 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-center">
                <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{b.name}</span>
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-on-surface">{b.rate}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{b.ppa}</p>
              </div>
              <div className="pt-2 border-t border-outline-variant flex items-center justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                <span>{b.update}</span>
                <span className={b.change.startsWith("+") ? "text-error" : b.change.startsWith("-") ? "text-primary" : "text-on-surface-variant"}>
                  {b.change}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-normal">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Treasury Bonds Table */}
      <div className="bg-surface-card border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-on-surface">Títulos do Tesouro Direto</h2>
          </div>
          <div className="text-on-surface-variant text-xs font-sans font-bold uppercase tracking-wider">
            Emissões de Dívida Soberana
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="px-6 py-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Código do Título</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Taxa de Rendimento Anual</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Investimento Mín.</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 font-sans text-xs font-bold text-on-surface-variant uppercase tracking-wider">Data de Vencimento</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {treasuryBonds.map((bond, idx) => (
                <tr key={idx} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4 font-sans text-sm font-bold text-on-surface">{bond.code}</td>
                  <td className="px-6 py-4 font-mono text-sm text-right font-bold text-primary">{bond.rate}</td>
                  <td className="px-6 py-4 font-mono text-sm text-right text-on-surface font-semibold">{bond.minInvestment}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container-high text-on-surface uppercase">
                      {bond.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">{bond.maturity}</td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

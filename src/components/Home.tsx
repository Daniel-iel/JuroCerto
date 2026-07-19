import { ArrowRight, TrendingUp, BarChart3, Brain, Zap } from "lucide-react";

interface HomeProps {
  onEnter: () => void;
}

export default function Home({ onEnter }: HomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 flex flex-col items-center justify-center px-4 py-20">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="mb-6">
          <img src="/logo_jc.png" alt="JuroCerto" className="h-16 mx-auto mb-4" />
          <div className="text-xs tracking-widest text-slate-400 font-bold uppercase">Investimentos em Renda Fixa</div>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Simule seus Investimentos
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
            com Inteligência
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
          Calcule rendimentos de CDB, LCI, LCA e Tesouro Direto com análise de impostos, comparações e recomendações de IA em tempo real.
        </p>

        {/* CTA Button */}
        <button
          onClick={onEnter}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-600/30 transition-all transform hover:scale-105 text-lg"
        >
          Começar Agora
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Features Grid */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-16 mt-12">
        {/* Feature 1: Calculadoras */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Calculadoras Avançadas</h3>
          <p className="text-slate-600 text-sm">
            CDB, LCI, LCA, Tesouro Direto e mais. Simule com suas próprias condições.
          </p>
        </div>

        {/* Feature 2: Análise de Impostos */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Análise de Impostos</h3>
          <p className="text-slate-600 text-sm">
            Cálculos de IR regressivo, equivalência tributária e rentabilidade líquida.
          </p>
        </div>

        {/* Feature 3: Dados de Mercado */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Dados em Tempo Real</h3>
          <p className="text-slate-600 text-sm">
            SELIC, CDI, IPCA e taxas de Tesouro Direto atualizados constantemente.
          </p>
        </div>

        {/* Feature 4: IA Advisor */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Assistente com IA</h3>
          <p className="text-slate-600 text-sm">
            Chat com IA especializada em investimentos para tirar suas dúvidas.
          </p>
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-2xl mx-auto text-center py-8 border-t border-slate-200">
        <p className="text-sm text-slate-500 mb-4">Plataforma 100% gratuita e segura</p>
        <div className="flex gap-4 justify-center text-xs text-slate-500">
          <span>✓ Sem taxas</span>
          <span>✓ Sem intermediários</span>
          <span>✓ Dados atualizados</span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="mt-12">
        <button
          onClick={onEnter}
          className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2 transition-colors"
        >
          Explorar a plataforma
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

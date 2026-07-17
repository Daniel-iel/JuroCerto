import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopNavBar from "./components/TopNavBar";
import DashboardTab from "./components/DashboardTab";
import ComparisonsTab from "./components/ComparisonsTab";
import CalculatorsTab from "./components/CalculatorsTab";
import MarketDataTab from "./components/MarketDataTab";
import AIAdvisorTab from "./components/AIAdvisorTab";
import { TabPage } from "./types";
import { X, LayoutDashboard, Percent, Calculator, TrendingUp, Sparkles, Settings } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabPage>("dashboard");
  const [selectedCalculator, setSelectedCalculator] = useState<string>("compound");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Helper to handle tab shifts while auto-closing mobile menu
  const handleTabChange = (tab: TabPage) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleSelectCalculator = (calcName: string) => {
    setSelectedCalculator(calcName);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800">
      
      {/* 1. Desktop Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 2. Mobile Menu Overlay & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Drawer container */}
          <div className="relative flex w-full max-w-xs flex-col bg-white p-6 shadow-xl animate-slide-in">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div>
                <div className="font-display text-2xl font-bold text-brand-primary">YieldWise</div>
                <div className="text-[9px] tracking-widest text-slate-400 font-bold uppercase mt-1">Investment Hub</div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-500 hover:bg-slate-50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation links for mobile drawer */}
            <nav className="flex flex-col gap-2 mt-6 flex-grow">
              {[
                { id: "dashboard" as TabPage, label: "Dashboard", icon: LayoutDashboard },
                { id: "comparisons" as TabPage, label: "Comparisons", icon: Percent },
                { id: "calculators" as TabPage, label: "Calculators", icon: Calculator },
                { id: "market-data" as TabPage, label: "Market Data", icon: TrendingUp },
                { id: "ai-advisor" as TabPage, label: "AI Advisor", icon: Sparkles, highlight: true },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-left w-full transition-all ${
                      isActive
                        ? item.highlight
                          ? "bg-brand-primary text-white font-bold"
                          : "bg-brand-primary-container/10 text-brand-primary font-bold"
                        : item.highlight
                        ? "text-brand-primary hover:bg-brand-primary-container/10 font-bold"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs tracking-wider font-bold uppercase">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Footer User Profile */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-3">
              <img
                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
                alt="Alex Rivera - Advisor"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgL41nMqlymBilddOWiGzGKXL6R3gCYWueTa-JrUMKvsu8pWfS9fiKKAVE05nEAphuY0Cvlg4--WLej3x6BX0cHGwTnv-ZlmER-48B7uvmihCOCM8ISShKggr-S0vcnMWwLczrrCBzst2dKrQLgFjm-UE54CgoLZ97umQKS5i-QxxgJNxAd3itjV3nWHD8QYKIMlZvp9IOwC3GfUl3bt_KnLXo9iYOn91ppYUzujEyvtdlFsVwmlVTgXTw8fwOKdvHdyl52gwYPKA"
              />
              <div>
                <p className="text-xs tracking-wider font-bold text-slate-800">Alex Rivera</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Premium Plan</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-grow flex flex-col md:pl-64 min-h-screen">
        
        {/* Header bar */}
        <TopNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic active page tab mount */}
        <main className="flex-grow p-4 md:p-12 max-w-7xl w-full mx-auto pb-20">
          {activeTab === "dashboard" && (
            <DashboardTab 
              onTabChange={handleTabChange} 
              onSelectCalculator={handleSelectCalculator} 
            />
          )}
          {activeTab === "comparisons" && (
            <ComparisonsTab 
              onTabChange={handleTabChange} 
            />
          )}
          {activeTab === "calculators" && (
            <CalculatorsTab 
              initialCalculator={selectedCalculator} 
            />
          )}
          {activeTab === "market-data" && (
            <MarketDataTab />
          )}
          {activeTab === "ai-advisor" && (
            <AIAdvisorTab />
          )}
        </main>
      </div>
    </div>
  );
}

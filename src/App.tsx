import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardTab from "./components/DashboardTab";
import ComparisonsTab from "./components/ComparisonsTab";
import CalculatorsTab from "./components/CalculatorsTab";
import { TabPage } from "./types";
import { X, LayoutDashboard, Percent, Calculator } from "lucide-react";

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
                <img src="/logo_jc.png" alt="YieldWise" className="h-10" />
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
          </div>
        </div>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-grow flex flex-col md:pl-64 min-h-screen">
        
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
        </main>
      </div>
    </div>
  );
}

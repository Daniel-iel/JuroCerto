import { Bell, User, Menu, Sparkles } from "lucide-react";
import { TabPage } from "../types";

interface TopNavBarProps {
  activeTab: TabPage;
  onTabChange: (tab: TabPage) => void;
  onMobileMenuToggle: () => void;
}

export default function TopNavBar({
  activeTab,
  onTabChange,
  onMobileMenuToggle,
}: TopNavBarProps) {
  const tabs = [
    { id: "dashboard" as TabPage, label: "Dashboard" },
    { id: "comparisons" as TabPage, label: "Comparisons" },
    { id: "calculators" as TabPage, label: "Calculators" },
    { id: "market-data" as TabPage, label: "Market Data" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex justify-between items-center px-4 md:px-12 w-full sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-display text-xl font-bold text-brand-primary flex items-center gap-1">
          <span>YieldWise</span>
        </div>
      </div>

      {/* Navigation for standard desktop view */}
      <nav className="hidden md:flex items-center gap-8 h-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`font-sans text-sm font-medium h-full px-2 border-b-2 flex items-center transition-all ${
                isActive
                  ? "border-brand-primary text-brand-primary font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
        <button
          onClick={() => onTabChange("ai-advisor")}
          className={`font-sans text-sm font-bold h-full px-2 border-b-2 flex items-center gap-1 transition-all ${
            activeTab === "ai-advisor"
              ? "border-brand-primary text-brand-primary"
              : "border-transparent text-emerald-600 hover:text-emerald-800"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Advisor</span>
        </button>
      </nav>

      {/* Notifications and Profile */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full text-slate-500 hover:text-brand-primary hover:bg-slate-100 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
        <button 
          onClick={() => onTabChange("ai-advisor")} 
          className="p-1 rounded-full border border-slate-200 text-slate-500 hover:text-brand-primary hover:bg-slate-100 transition-all"
        >
          <img
            className="w-7 h-7 rounded-full object-cover"
            alt="Advisor Avatar"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-zBoFl7AzjIQZqIHG8hlPajps9cle6maELutCxowaXn_8dpWpU1-031UpOCDY8CQx46qs64Xl2e5-bWyJ6OUfCWeAWN50fIqtI5cSilAg995o5Ne6uBFKNXarS-JaYCwn4_Dl7l9M98qeIQFCiREnqjmXIYiGvmLfPRQH8Dq4Wj6JGT-CfIc7VLYpI81c6OwNhkD08-oU6jq34JD3KTrCZPMxxo9VQjcw5uQ3YKyxDLIpMbUYJWhSyv4aUfmqKHpN-Dl41Txmobc"
          />
        </button>
      </div>
    </header>
  );
}

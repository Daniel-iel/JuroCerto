import { LayoutDashboard, Percent, Calculator, TrendingUp, Settings, Sparkles } from "lucide-react";
import { TabPage } from "../types";

interface SidebarProps {
  activeTab: TabPage;
  onTabChange: (tab: TabPage) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as TabPage, label: "Dashboard", icon: LayoutDashboard },
    { id: "comparisons" as TabPage, label: "Comparisons", icon: Percent },
    { id: "calculators" as TabPage, label: "Calculators", icon: Calculator },
    { id: "market-data" as TabPage, label: "Market Data", icon: TrendingUp },
    { id: "ai-advisor" as TabPage, label: "AI Advisor", icon: Sparkles, highlight: true },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen p-4 gap-4 border-r border-slate-200 bg-slate-50 w-64 fixed left-0 top-0 z-20">
      <div className="mb-6 p-2">
        <div className="font-display text-2xl font-bold text-brand-primary">YieldWise</div>
        <div className="text-[10px] tracking-widest text-slate-500 font-bold uppercase mt-1">Investment Hub</div>
      </div>

      <nav className="flex flex-col gap-1.5 flex-grow">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl duration-150 ease-in-out cursor-pointer text-left w-full transition-all ${
                isActive
                  ? item.highlight
                    ? "bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/10"
                    : "bg-brand-primary-container/15 text-brand-on-primary-container font-bold border-l-4 border-brand-primary-container"
                  : item.highlight
                  ? "text-brand-primary hover:bg-brand-primary-container/10 font-medium"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive && item.highlight ? "text-white" : ""}`} />
              <span className="text-xs tracking-wider font-bold uppercase">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary-container"></span>
                </span>
              )}
            </button>
          );
        })}

        <button
          onClick={() => onTabChange("dashboard")}
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-200/60 rounded-xl duration-150 ease-in-out cursor-pointer mt-auto text-left w-full"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs tracking-wider font-bold uppercase">Settings</span>
        </button>
      </nav>

      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
        <img
          className="w-10 h-10 rounded-full border border-slate-200 object-cover"
          alt="Alex Rivera - Advisor"
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgL41nMqlymBilddOWiGzGKXL6R3gCYWueTa-JrUMKvsu8pWfS9fiKKAVE05nEAphuY0Cvlg4--WLej3x6BX0cHGwTnv-ZlmER-48B7uvmihCOCM8ISShKggr-S0vcnMWwLczrrCBzst2dKrQLgFjm-UE54CgoLZ97umQKS5i-QxxgJNxAd3itjV3nWHD8QYKIMlZvp9IOwC3GfUl3bt_KnLXo9iYOn91ppYUzujEyvtdlFsVwmlVTgXTw8fwOKdvHdyl52gwYPKA"
        />
        <div className="overflow-hidden">
          <p className="text-xs tracking-wider font-bold truncate text-slate-800">Alex Rivera</p>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Premium Plan</p>
        </div>
      </div>
    </aside>
  );
}

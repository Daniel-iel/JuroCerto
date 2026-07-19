import { LayoutDashboard, Percent, Calculator } from "lucide-react";
import { TabPage } from "../types";

interface SidebarProps {
  activeTab: TabPage;
  onTabChange: (tab: TabPage) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard" as TabPage, label: "Painel", icon: LayoutDashboard, highlight: false },
    { id: "comparisons" as TabPage, label: "Comparações", icon: Percent, highlight: false },
    { id: "calculators" as TabPage, label: "Calculadoras", icon: Calculator, highlight: false },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen p-4 gap-4 border-r border-outline-variant bg-surface-card w-64 fixed left-0 top-0 z-20">
      <div className="mb-6 p-2">
        <img src="/logo_jc.png" alt="JuroCerto" className="h-12" />
        <div className="text-[10px] tracking-widest text-on-surface-variant font-bold uppercase mt-1">Calculadora de Rendimentos</div>
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
                    ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/10"
                    : "bg-surface-container text-on-surface font-bold border-l-4 border-primary"
                  : item.highlight
                  ? "text-primary hover:bg-surface-container/10 font-medium"
                  : "text-on-surface-variant hover:bg-surface-container/60"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive && item.highlight ? "text-on-primary" : ""}`} />
              <span className="text-xs tracking-wider font-bold uppercase">{item.label}</span>
              {item.highlight && !isActive && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
              )}
            </button>
          );
        })}
      </nav>


    </aside>
  );
}

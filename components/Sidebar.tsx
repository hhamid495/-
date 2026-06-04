
import React from 'react';
import { LayoutDashboard, Users, UserRound, School, FileText, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'students', label: 'الطلاب', icon: Users },
    { id: 'teachers', label: 'المعلمون', icon: UserRound },
    { id: 'classes', label: 'الأقسام', icon: School },
    { id: 'reports', label: 'تقارير الذكاء الاصطناعي', icon: FileText },
  ];

  return (
    <div className="w-64 bg-indigo-900 text-white h-screen fixed right-0 top-0 flex flex-col shadow-xl z-50 print:hidden">
      <div className="p-6 text-2xl font-bold flex items-center gap-3 border-b border-indigo-800">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          <School className="text-indigo-900" />
        </div>
        <span>مدارسي</span>
      </div>
      
      <nav className="flex-1 mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-out font-bold text-sm ${
                  activeTab === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-955/35 -translate-x-1.5' 
                    : 'text-indigo-200 hover:text-white hover:bg-white/10 hover:scale-[1.02] active:scale-95'
                }`}
              >
                <item.icon size={18} className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-bold tracking-tight">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-indigo-950">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-300 hover:bg-rose-600 hover:text-white hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out font-bold text-sm">
          <LogOut size={18} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

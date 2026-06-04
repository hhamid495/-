
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import TeacherList from './components/TeacherList';
import AIReports from './components/AIReports';
import ClassList from './components/ClassList';
import { Bell, Search, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'students': return <StudentList />;
      case 'teachers': return <TeacherList />;
      case 'reports': return <AIReports />;
      case 'classes': return <ClassList />;
      default: return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'لوحة التحكم العامة';
      case 'students': return 'إدارة شؤون الطلاب';
      case 'teachers': return 'إدارة هيئة التدريس';
      case 'classes': return 'تسيير الأقسام الدراسية';
      case 'reports': return 'التقارير الذكية (AI)';
      default: return 'مدارسي';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex print:bg-white print:block">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 mr-64 p-8 transition-all print:mr-0 print:p-0">
        {/* Header */}
        <header className="flex justify-between items-center mb-10 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{getPageTitle()}</h1>
            <p className="text-slate-500 mt-1 font-medium">مرحباً بك مجدداً، مدير المدرسة</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="بحث سريع..." 
                className="pr-10 pl-4 py-2 bg-white border border-slate-200 rounded-xl w-64 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
              />
            </div>
            
            <button className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors bg-white rounded-xl shadow-sm border border-slate-100">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 bg-white p-1.5 pl-4 pr-1.5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">أحمد بن منصور</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">مدير مدرسة</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                <UserCircle size={24} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="pb-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;


import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, GraduationCap, School, TrendingUp } from 'lucide-react';

const data = [
  { name: 'س 1', students: 120 },
  { name: 'س 2', students: 110 },
  { name: 'س 3', students: 140 },
  { name: 'س 4', students: 105 },
  { name: 'س 5', students: 95 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC = () => {
  const studentsCount = React.useMemo(() => {
    const saved = localStorage.getItem('madarisi_students');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Compute delta compared to the 6 mock students
        return Math.max(0, 570 + (parsed.length - 6));
      } catch (e) {
        return 570;
      }
    }
    return 570;
  }, []);

  const teachersCount = React.useMemo(() => {
    const saved = localStorage.getItem('madarisi_teachers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Compute delta compared to the 5 mock teachers
        return Math.max(0, 42 + (parsed.length - 5));
      } catch (e) {
        return 42;
      }
    }
    return 42;
  }, []);

  const classesCount = React.useMemo(() => {
    const saved = localStorage.getItem('madarisi_classes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Compute delta compared to 5 INITIAL_CLASSES (5 items)
        return Math.max(0, 24 + (parsed.length - 5));
      } catch (e) {
        return 24;
      }
    }
    return 24;
  }, []);

  const stats = [
    { label: 'إجمالي الطلاب', value: String(studentsCount), icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'المعلمون', value: String(teachersCount), icon: GraduationCap, color: 'bg-green-100 text-green-600' },
    { label: 'الأقسام الدراسية', value: String(classesCount), icon: School, color: 'bg-orange-100 text-orange-600' },
    { label: 'نسبة الحضور', value: '94%', icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-sm font-medium text-slate-400">اليوم</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
            <p className="text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">توزيع الطلاب حسب المستوى</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">نسبة الغيابات الأسبوعية</h3>
          <div className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'حضور', value: 94 },
                    { name: 'غياب مبرر', value: 4 },
                    { name: 'غياب غير مبرر', value: 2 },
                  ]}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4">
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-600"></div><span className="text-sm text-slate-600">حضور</span></div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-sm text-slate-600">مبرر</span></div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-sm text-slate-600">غير مبرر</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Copy, FileText, Printer } from 'lucide-react';
import { generateStudentReport } from '../services/geminiService';
import { MOCK_STUDENTS } from '../constants';
import { Student } from '../types';

const AIReports: React.FC = () => {
  const [students] = useState<Student[]>(() => {
    const saved = localStorage.getItem('madarisi_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });
  const [selectedStudent, setSelectedStudent] = useState('');
  const [observations, setObservations] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');

  const handleGenerate = async () => {
    if (!selectedStudent || !observations) return;
    setLoading(true);
    const student = students.find(s => s.id === selectedStudent);
    if (student) {
      // Calculate level statistics
      const levelStudents = students.filter(s => s.level === student.level);
      
      // Collect all unique subjects in this level
      const subjects = new Set<string>();
      levelStudents.forEach(s => s.performance?.forEach(p => subjects.add(p.label)));
      
      // Calculate averages for each subject
      const averages: Record<string, number> = {};
      subjects.forEach(subject => {
        const scores = levelStudents
          .map(s => s.performance?.find(p => p.label === subject)?.score)
          .filter((score): score is number => score !== undefined);
        
        if (scores.length > 0) {
          averages[subject] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        }
      });

      const studentPerformanceStr = student.performance 
        ? student.performance.map(p => `- ${p.label}: ${p.score}/100`).join('\n')
        : 'لا توجد بيانات أداء مسجلة.';

      const levelAverageStr = Object.entries(averages)
        .map(([label, score]) => `- ${label}: ${score}/100`)
        .join('\n') || 'لا توجد بيانات متوسطة للمستوى.';

      const result = await generateStudentReport(
        student.name, 
        student.level, 
        observations,
        studentPerformanceStr,
        levelAverageStr
      );
      setReport(result || '');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 print:space-y-0 print:max-w-none print:w-full">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 print:hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">منشئ التقارير بالذكاء الاصطناعي</h2>
            <p className="text-slate-500">قم بتوليد تقارير تربوية شاملة ومخصصة لكل طالب في ثوانٍ.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">اختر الطالب</label>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">-- اختر طالباً من القائمة --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name} - {s.level}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 block">ملاحظات المعلم السريعة</label>
            <input 
              type="text"
              placeholder="مثال: ممتاز في الحساب، يحتاج تركيز أكثر في الإملاء"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !selectedStudent || !observations}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <><Sparkles size={20} /> إنشاء التقرير</>
          )}
        </button>
      </div>

      {report && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-indigo-50 animate-in zoom-in duration-300 print:border-none print:shadow-none print:p-0 print:bg-white print:zoom-none">
          {/* Official School Header for report card - Only visible during print */}
          <div className="hidden print:block text-right mb-10 border-b-2 border-slate-800 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-900">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
                <h3 className="text-sm font-bold text-slate-900 mt-1">وزارة التربية الوطنية</h3>
                <h4 className="text-xs font-bold text-slate-700 mt-2">مديرية التربية لولاية باتنة</h4>
                <h4 className="text-xs font-bold text-slate-700">المدرسة الابتدائية: دراغله محمد - فم الطوب</h4>
              </div>
              <div className="text-left font-sans">
                <p className="text-xs font-bold text-slate-600">التاريخ: {new Date().toLocaleDateString('ar-DZ')}</p>
                <p className="text-xs text-slate-500 mt-1">المنشئ: مدير المدرسة بالتنسيق مع الذكاء الاصطناعي</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <h1 className="text-2xl font-black text-slate-950 border-t border-b border-slate-350 py-3 inline-block px-12">بطاقة التقييم التربوي الشامل</h1>
              <p className="text-base text-indigo-700 mt-2 font-black">للطالب(ة): {students.find(s => s.id === selectedStudent)?.name} (ID: {selectedStudent})</p>
              <p className="text-xs text-slate-600 mt-1 font-bold">المستوى الدراسي: {students.find(s => s.id === selectedStudent)?.level}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 print:hidden">
            <div className="flex items-center gap-2 text-indigo-600">
              <FileText size={20} />
              <span className="font-bold">التقرير المولد</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2.5 rounded-xl transition-all font-bold text-sm shadow-md shadow-emerald-100"
              >
                <Printer size={16} /> تصدير PDF / طباعة التقدير
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(report)}
                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-slate-50 border border-slate-200 transition-all font-medium text-sm"
              >
                <Copy size={16} /> نسخ النص
              </button>
            </div>
          </div>

          <div className="prose prose-indigo max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap print:text-black print:text-base print:leading-loose">
            {report}
          </div>

          {/* Official Signature block at the bottom - Only visible during print */}
          <div className="hidden print:flex justify-between items-center mt-16 pt-8 border-t-2 border-dashed border-slate-300">
            <div className="text-center w-1/3">
              <h4 className="text-xs font-bold text-slate-400">إمضاء الولي</h4>
              <div className="h-16"></div>
              <p className="text-[10px] text-slate-300">_________________</p>
            </div>
            <div className="text-center w-1/3">
              <h4 className="text-xs font-bold text-slate-400">إمضاء معلم القسم</h4>
              <div className="h-16"></div>
              <p className="text-[10px] text-slate-300">_________________</p>
            </div>
            <div className="text-center w-1/3">
              <h4 className="text-sm font-bold text-slate-850">ختم وإمضاء مدير المدرسة</h4>
              <div className="h-16"></div>
              <p className="text-xs text-slate-600 font-bold">أحمد بن منصور</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIReports;

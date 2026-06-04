
import React, { useState } from 'react';
import { 
  Search, Plus, Edit, Trash2, X, User, 
  Calculator, Languages, Palette, 
  Trophy, BookOpen, BookText, ShieldCheck, 
  Music, AlertTriangle, ChevronDown, Calendar, 
  Hash, Contact, Atom, Globe, Key, RefreshCw, 
  Copy, Check, FileDown, Filter, Users, Star,
  TrendingUp, Award, MessageSquareQuote, Microscope,
  Library, Mail, Phone
} from 'lucide-react';
import { MOCK_TEACHERS } from '../constants';
import { Teacher } from '../types';

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('madarisi_teachers');
    return saved ? JSON.parse(saved) : MOCK_TEACHERS;
  });

  React.useEffect(() => {
    localStorage.setItem('madarisi_teachers', JSON.stringify(teachers));
  }, [teachers]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    phone: '',
    notes: '',
    registrationDate: new Date().toISOString().split('T')[0],
    apiKey: '',
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
  });

  const uniqueSubjects: string[] = Array.from(new Set(teachers.map(t => t.subject)));

  const handleExportCSV = () => {
    const BOM = '\uFEFF';
    const headers = ['الاسم', 'المادة', 'البريد الإلكتروني', 'رقم الهاتف'];
    const csvRows = [
      headers.join(','),
      ...filteredTeachers.map(teacher => [
        `"${teacher.name}"`,
        `"${teacher.subject}"`,
        `"${teacher.email}"`,
        `"${teacher.phone}"`
      ].join(','))
    ];
    
    const csvString = BOM + csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `قائمة_المعلمين_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateApiKey = () => {
    const randomPart = () => Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKey = `SCH-${randomPart()}-${randomPart()}-${randomPart()}`;
    setFormData({ ...formData, apiKey: newKey });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSubjectStyle = (subject: string) => {
    const s = subject.toLowerCase();
    
    if (s === 'all') return {
      icon: <Users size={16} />,
      colors: 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-400/10'
    };
    if (s.includes('رياضيات') || s.includes('حساب')) return { 
      icon: <Calculator size={16} />, 
      colors: 'bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/15' 
    };
    if (s.includes('عربية') || s.includes('لغة أم')) return { 
      icon: <BookText size={16} />, 
      colors: 'bg-green-100 text-green-700 border-green-200 ring-green-500/15' 
    };
    if (s.includes('فرنسية') || s.includes('إنجليزية') || s.includes('لغات')) return { 
      icon: <Languages size={16} />, 
      colors: 'bg-orange-100 text-orange-700 border-orange-200 ring-orange-500/15' 
    };
    if (s.includes('علوم') || s.includes('فيزياء') || s.includes('طبيعة') || s.includes('تكنولوجية') || s.includes('علمية')) return { 
      icon: <Microscope size={16} />, 
      colors: 'bg-indigo-100 text-indigo-700 border-indigo-200 ring-indigo-500/15' 
    };
    if (s.includes('فنية') || s.includes('رسم') || s.includes('تشكيلية')) return { 
      icon: <Palette size={16} />, 
      colors: 'bg-pink-100 text-pink-700 border-pink-200 ring-pink-500/15' 
    };
    if (s.includes('موسيقى')) return { 
      icon: <Music size={16} />, 
      colors: 'bg-purple-100 text-purple-700 border-purple-200 ring-purple-500/15' 
    };
    if (s.includes('رياضة') || s.includes('بدنية')) return { 
      icon: <Trophy size={16} />, 
      colors: 'bg-red-100 text-red-700 border-red-200 ring-red-500/15' 
    };
    if (s.includes('إسلامية') || s.includes('قرآن') || s.includes('دين')) return { 
      icon: <BookOpen size={16} />, 
      colors: 'bg-emerald-100 text-emerald-700 border-emerald-200 ring-emerald-500/15' 
    };
    if (s.includes('مدنية') || s.includes('قانون')) return { 
      icon: <ShieldCheck size={16} />, 
      colors: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/15' 
    };
    if (s.includes('تاريخ') || s.includes('جغرافيا') || s.includes('اجتماعيات')) return { 
      icon: <Globe size={16} />, 
      colors: 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/15' 
    };
    if (s.includes('مكتبة') || s.includes('مطالعة')) return {
      icon: <Library size={16} />,
      colors: 'bg-stone-100 text-stone-700 border-stone-200 ring-stone-500/15'
    };
    
    return { 
      icon: <BookText size={16} />, 
      colors: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/15' 
    };
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.includes(searchTerm) || teacher.subject.includes(searchTerm);
    const matchesSubject = selectedSubject === 'all' || teacher.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTeacher: Teacher = {
      id: `T${Math.floor(100 + Math.random() * 899)}`,
      ...formData
    };
    setTeachers([...teachers, newTeacher]);
    setIsModalOpen(false);
    setFormData({
      name: '',
      subject: '',
      email: '',
      phone: '',
      notes: '',
      registrationDate: new Date().toISOString().split('T')[0],
      apiKey: '',
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, teacher: Teacher) => {
    e.stopPropagation();
    setTeacherToDelete(teacher);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      setTeachers(prev => prev.filter(t => t.id !== teacherToDelete.id));
      if (expandedId === teacherToDelete.id) setExpandedId(null);
      setIsDeleteModalOpen(false);
      setTeacherToDelete(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Subject Filter Bar */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Filter size={18} className="text-indigo-600" />
          <h3 className="font-black text-slate-700 text-sm uppercase tracking-wider">تصفية حسب التخصص</h3>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all whitespace-nowrap active:scale-95 ${
              selectedSubject === 'all' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-200'
            }`}
          >
            <Users size={18} />
            <span className="font-black">كل الطاقم</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedSubject === 'all' ? 'bg-indigo-500' : 'bg-slate-100'}`}>
              {teachers.length}
            </span>
          </button>

          {uniqueSubjects.map((subject: string) => {
            const style = getSubjectStyle(subject);
            const isSelected = selectedSubject === subject;
            const count = teachers.filter(t => t.subject === subject).length;
            
            return (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl border-2 transition-all whitespace-nowrap active:scale-95 ${
                  isSelected 
                    ? `${style.colors.split(' ')[0]} border-current shadow-lg` 
                    : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200'
                }`}
                style={isSelected ? { borderColor: 'currentColor' } : {}}
              >
                {style.icon}
                <span className="font-black">{subject}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/30' : 'bg-slate-100'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6 bg-gradient-to-l from-white to-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
              <User size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">هيئة التدريس</h2>
              <p className="text-slate-500 text-sm font-medium">إدارة وتوجيه الكادر التعليمي للمدرسة</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="بحث بالاسم أو المادة..."
                className="w-full pr-12 pl-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportCSV}
                title="تصدير القائمة"
                className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <FileDown size={22} />
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 whitespace-nowrap"
              >
                <Plus size={22} />
                <span className="font-bold">إضافة معلم</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-5 text-right w-12"></th>
                <th className="px-4 py-5 text-right w-32">المعلم</th>
                <th className="px-8 py-5">المعلومات المهنية</th>
                <th className="px-8 py-5 text-center">التحكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => {
                  const subjectStyle = getSubjectStyle(teacher.subject);
                  const isExpanded = expandedId === teacher.id;
                  return (
                    <React.Fragment key={teacher.id}>
                      <tr 
                        onClick={() => toggleExpand(teacher.id)}
                        className={`hover:bg-indigo-50/30 transition-all group cursor-pointer ${isExpanded ? 'bg-indigo-50/50' : ''}`}
                      >
                        <td className="px-8 py-6 text-center">
                          <ChevronDown 
                            size={20} 
                            className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                          />
                        </td>
                        <td className="px-4 py-6 whitespace-nowrap">
                          <div className="relative inline-block">
                            <img 
                              src={teacher.photo} 
                              alt={teacher.name} 
                              className="w-16 h-16 rounded-[1.25rem] object-cover ring-4 ring-white shadow-xl group-hover:scale-105 transition-transform duration-300"
                            />
                            {teacher.rating && (
                              <div className="absolute -bottom-2 -right-2 bg-white px-2 py-0.5 rounded-lg shadow-md border border-slate-100 flex items-center gap-1">
                                <Star size={10} className="fill-amber-400 text-amber-400" />
                                <span className="text-[10px] font-black text-slate-700">{teacher.rating}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex flex-col gap-3">
                            <div className="font-black text-slate-800 text-lg group-hover:text-indigo-700 transition-colors leading-tight">
                              {teacher.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black border transition-all shadow-sm ring-1 group-hover:shadow-md ${subjectStyle.colors}`}>
                                {React.cloneElement(subjectStyle.icon as React.ReactElement<{size?: number}>, { size: 14 })}
                                <span>{teacher.subject}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-3">
                            <button onClick={(e) => { e.stopPropagation(); }} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-slate-100">
                              <Edit size={20} />
                            </button>
                            <button onClick={(e) => handleDeleteClick(e, teacher)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-slate-100">
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr className="bg-gradient-to-l from-indigo-50/10 via-slate-50/5 to-indigo-50/10 border-b border-indigo-100/40 animate-in slide-in-from-top-2 duration-300">
                          <td colSpan={4} className="px-8 md:px-12 py-8 relative overflow-hidden">
                            {/* Glassmorphism Ambient Glows in the background to showcase the backdrop blur */}
                            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-56 h-56 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-6 left-1/3 w-40 h-40 bg-cyan-200/15 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute top-6 right-1/3 w-32 h-32 bg-amber-200/10 rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Left Column: Basic Professional Info */}
                              <div className="space-y-4">
                                <div className="bg-white/45 backdrop-blur-xl p-5 rounded-[2rem] shadow-lg shadow-indigo-100/15 border border-white/60 flex items-center gap-4 group/card hover:bg-white/65 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/25 transition-all duration-300">
                                  <div className={`p-4 rounded-2xl shadow-inner transition-all ${subjectStyle.colors}`}>
                                    {React.cloneElement(subjectStyle.icon as React.ReactElement<{size?: number}>, { size: 24 })}
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">مادة التخصص</p>
                                    <p className="text-base font-black text-slate-800">{teacher.subject}</p>
                                  </div>
                                </div>

                                <div className="bg-white/45 backdrop-blur-xl p-5 rounded-[2rem] shadow-lg shadow-indigo-100/15 border border-white/60 flex flex-col gap-2 group/card hover:bg-white/65 hover:border-cyan-300 hover:shadow-xl hover:shadow-indigo-100/25 transition-all duration-300">
                                  <div className="flex items-center gap-4">
                                    <div className="p-3 bg-cyan-50/80 text-cyan-600 rounded-2xl shadow-inner group-hover/card:bg-cyan-600 group-hover/card:text-white transition-all">
                                      <Key size={22} />
                                    </div>
                                    <div>
                                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">مفتاح API الخاص</p>
                                      <p className="text-sm font-black text-slate-800 font-mono">{teacher.apiKey || 'لم يتم تعيين مفتاح'}</p>
                                    </div>
                                  </div>
                                  {teacher.apiKey && (
                                    <button 
                                      onClick={() => copyToClipboard(teacher.apiKey!, teacher.id)}
                                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/50 hover:bg-white/80 border border-white/40 rounded-xl text-xs font-bold text-slate-500 transition-all mt-2"
                                    >
                                      {copiedId === teacher.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                      {copiedId === teacher.id ? 'تم النسخ!' : 'نسخ المفتاح'}
                                    </button>
                                  )}
                                </div>
                              </div>

                              {/* Center Column: Performance & Ratings */}
                              <div className="bg-white/45 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-lg shadow-indigo-100/15 border border-white/60 relative overflow-hidden group/performance hover:bg-white/65 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/25 transition-all duration-300">
                                <div className="flex items-center justify-between mb-6">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                      <TrendingUp size={20} />
                                    </div>
                                    <h4 className="text-lg font-black text-slate-800">الأداء والتقييم</h4>
                                  </div>
                                  {teacher.rating && (
                                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                      <Star size={14} className="fill-amber-400 text-amber-400" />
                                      <span className="text-sm font-black text-amber-700">{teacher.rating}</span>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-5">
                                  {teacher.notes && (
                                    <div className="p-4 bg-amber-50/45 backdrop-blur-md rounded-2xl border border-amber-200/30 mb-4">
                                      <div className="flex items-center gap-2 mb-2">
                                        <MessageSquareQuote size={14} className="text-amber-600" />
                                        <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">ملاحظات إدارية</span>
                                      </div>
                                      <p className="text-sm font-bold text-slate-700 leading-relaxed italic">"{teacher.notes}"</p>
                                    </div>
                                  )}

                                  {teacher.performance ? (
                                    teacher.performance.map((metric, index) => (
                                      <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center text-[11px] font-black text-slate-500 uppercase tracking-wider">
                                          <span>{metric.label}</span>
                                          <span className="text-indigo-600">{metric.score}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100/80 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-l from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${metric.score}%` }}
                                          />
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-4 text-slate-400">
                                      <MessageSquareQuote size={32} className="opacity-20 mb-2" />
                                      <p className="text-xs font-bold">لا توجد بيانات تقييم حالياً</p>
                                    </div>
                                  )}
                                </div>

                                <div className="mt-6 pt-5 border-t border-slate-200/40 flex items-center gap-3">
                                  <Award size={16} className="text-emerald-500" />
                                  <p className="text-[10px] font-bold text-slate-400">آخر تحديث للتقييم: الفصل الدراسي الأول 2024</p>
                                </div>
                              </div>

                              {/* Right Column: Contact Info */}
                              <div className="bg-white/45 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-lg shadow-indigo-100/15 border border-white/60 relative overflow-hidden group/contact hover:bg-white/65 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/25 transition-all duration-300">
                                <div className="relative flex items-center gap-3 mb-6">
                                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg">
                                    <Contact size={20} />
                                  </div>
                                  <h4 className="text-lg font-black text-slate-800">بيانات التواصل</h4>
                                </div>
                                <div className="space-y-4">
                                  <div className="p-4 bg-white/35 backdrop-blur-md rounded-2xl border border-white/50 group/item hover:bg-white/80 hover:border-indigo-200 transition-all shadow-sm">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">البريد الإلكتروني</span>
                                    <p className="text-sm font-black text-slate-700 truncate">{teacher.email}</p>
                                  </div>
                                  <div className="p-4 bg-white/35 backdrop-blur-md rounded-2xl border border-white/50 group/item hover:bg-white/80 hover:border-emerald-200 transition-all shadow-sm">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">رقم الهاتف</span>
                                    <p className="text-base font-black text-slate-700" dir="ltr">{teacher.phone}</p>
                                  </div>
                                </div>
                                <div className="mt-6 pt-5 border-t border-slate-200/40 flex flex-col gap-2 text-[10px] font-bold text-slate-400">
                                  <span className="flex items-center gap-2">
                                    <Calendar size={12} /> تاريخ التسجيل: {teacher.registrationDate}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <Hash size={12} /> رقم المعرف: {teacher.id}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Search size={48} className="opacity-20" />
                      <p className="font-bold text-lg">لم يتم العثور على أي نتائج</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setSelectedSubject('all');}}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        إعادة تعيين البحث
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div 
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden border border-white/20"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <h3 className="text-2xl font-black text-slate-800">إضافة معلم جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-white text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm transition-all hover:rotate-90">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {/* Section 1: Personal Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <User size={20} />
                  </div>
                  <h4 className="font-black text-slate-800">المعلومات الشخصية</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">الاسم الكامل</label>
                    <input required type="text" placeholder="الأستاذ(ة)..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">المادة</label>
                    <div className="relative">
                      <input 
                        required 
                        type="text" 
                        placeholder="مثال: الرياضيات..." 
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold" 
                        value={formData.subject} 
                        onChange={e => setFormData({...formData, subject: e.target.value})} 
                      />
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl border transition-all duration-300 shadow-sm ${getSubjectStyle(formData.subject).colors}`}>
                        {React.cloneElement(getSubjectStyle(formData.subject).icon as React.ReactElement<{size?: number}>, { size: 18 })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Contact size={20} />
                  </div>
                  <h4 className="font-black text-slate-800">بيانات التواصل</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">البريد الإلكتروني</label>
                    <div className="relative">
                      <input required type="email" placeholder="email@school.dz" className="w-full pr-5 pl-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-left" dir="ltr" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                        <Mail size={18} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">رقم الهاتف</label>
                    <div className="relative">
                      <input required type="tel" placeholder="0XXXXXXXXX" className="w-full pr-5 pl-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-left" dir="ltr" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">
                        <Phone size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">ملاحظات أو تقييم أولي</label>
                  <textarea 
                    placeholder="أضف ملاحظات حول أداء المعلم أو خبراته..." 
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold resize-none" 
                    value={formData.notes} 
                    onChange={e => setFormData({...formData, notes: e.target.value})} 
                  />
                </div>
              </div>

              {/* Section 3: Administrative Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="font-black text-slate-800">الإعدادات الإدارية</h4>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <Key size={18} className="text-cyan-600" />
                    <h4 className="font-bold text-slate-700">مفتاح API الخاص</h4>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input 
                        type="text" 
                        placeholder="SCH-XXXX-XXXX-XXXX" 
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-mono text-sm font-bold"
                        value={formData.apiKey}
                        onChange={e => setFormData({...formData, apiKey: e.target.value})}
                      />
                    </div>
                    <button 
                      type="button"
                      onClick={generateApiKey}
                      className="px-6 bg-white border border-slate-200 text-cyan-600 rounded-2xl hover:bg-cyan-50 transition-all flex items-center gap-2 group shadow-sm active:scale-95"
                    >
                      <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                      <span className="font-bold whitespace-nowrap">توليد تلقائي</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">هذا المفتاح يستخدم للربط البرمجي مع أنظمة تقييم الأداء الخارجية.</p>
                </div>
              </div>

              <div className="pt-6 flex gap-4 sticky bottom-0 bg-white pb-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">إضافة المعلم للقاعدة</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div 
          onClick={() => setIsDeleteModalOpen(false)}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200 overflow-hidden border border-white/20"
          >
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-red-50/50">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">تأكيد الحذف النهائي</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">هل أنت متأكد من رغبتك في حذف المعلم <span className="font-black text-red-600 underline decoration-red-200 underline-offset-4">"{teacherToDelete?.name}"</span>؟</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 shadow-lg shadow-red-100 active:scale-95 order-2 sm:order-1">تأكيد الحذف</button>
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black hover:bg-slate-200 active:scale-95 order-1 sm:order-2">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherList;

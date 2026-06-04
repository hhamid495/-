import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Edit, Trash2, X, Printer, School, 
  GraduationCap, Users, Check, AlertTriangle, Users2, 
  User, Phone, Calendar, ArrowRight, Layers 
} from 'lucide-react';
import { Student, Teacher, ClassRoom, StudentLevel } from '../types';
import { MOCK_STUDENTS, MOCK_TEACHERS } from '../constants';

const INITIAL_CLASSES: ClassRoom[] = [
  { id: 'C101', name: 'السنة الأولى - الفوج أ', level: StudentLevel.LEVEL_1, teacherId: 'T101', capacity: 30 },
  { id: 'C102', name: 'السنة الثانية - الفوج ب', level: StudentLevel.LEVEL_2, teacherId: 'T104', capacity: 32 },
  { id: 'C103', name: 'السنة الثالثة - الفوج أ', level: StudentLevel.LEVEL_3, teacherId: 'T102', capacity: 28 },
  { id: 'C104', name: 'السنة الرابعة - الفوج ج', level: StudentLevel.LEVEL_4, teacherId: 'T103', capacity: 35 },
  { id: 'C105', name: 'السنة الخامسة - الفوج أ', level: StudentLevel.LEVEL_5, teacherId: 'T101', capacity: 25 },
];

const ClassList: React.FC = () => {
  // Load data streams with fallback to mock constants
  const [classes, setClasses] = useState<ClassRoom[]>(() => {
    const saved = localStorage.getItem('madarisi_classes');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [teachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('madarisi_teachers');
    return saved ? JSON.parse(saved) : MOCK_TEACHERS;
  });

  const [students] = useState<Student[]>(() => {
    const saved = localStorage.getItem('madarisi_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  React.useEffect(() => {
    localStorage.setItem('madarisi_classes', JSON.stringify(classes));
  }, [classes]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassRoom | null>(null);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);

  // Class student roster view
  const [viewingRosterClass, setViewingRosterClass] = useState<ClassRoom | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    level: StudentLevel.LEVEL_1,
    teacherId: '',
    capacity: 30
  });

  // Filter logic
  const filteredClasses = useMemo(() => {
    return classes.filter(cls => {
      const matchSearch = cls.name.includes(searchTerm);
      const matchLevel = selectedLevelFilter === 'all' || cls.level === selectedLevelFilter;
      return matchSearch && matchLevel;
    });
  }, [classes, searchTerm, selectedLevelFilter]);

  // Derived students count in each class level
  const getClassStudentCount = (level: StudentLevel) => {
    // If we want actual level-based enrollment
    return students.filter(s => s.level === level).length;
  };

  // Handler for opening add modal
  const handleOpenAddModal = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      level: StudentLevel.LEVEL_1,
      teacherId: teachers[0]?.id || '',
      capacity: 30
    });
    setIsModalOpen(true);
  };

  // Handler for opening edit modal
  const handleOpenEditModal = (cls: ClassRoom) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      level: cls.level,
      teacherId: cls.teacherId,
      capacity: cls.capacity
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingClass) {
      // Edit mode
      setClasses(classes.map(c => c.id === editingClass.id ? { ...c, ...formData } : c));
    } else {
      // Add mode
      const newClass: ClassRoom = {
        id: `C${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        level: formData.level,
        teacherId: formData.teacherId,
        capacity: Number(formData.capacity)
      };
      setClasses([newClass, ...classes]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (cls: ClassRoom) => {
    setClassToDelete(cls);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (classToDelete) {
      setClasses(classes.filter(c => c.id !== classToDelete.id));
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
    }
  };

  // Calculate stats for top of screen
  const statsSummary = useMemo(() => {
    const totalClasses = classes.length;
    const avgCapacity = totalClasses ? Math.round(classes.reduce((acc, curr) => acc + curr.capacity, 0) / totalClasses) : 0;
    // Compute level student matches
    const totalAssignedStudents = classes.reduce((acc, curr) => acc + getClassStudentCount(curr.level), 0);
    return { totalClasses, avgCapacity, totalAssignedStudents };
  }, [classes, students]);

  // Find assigned teacher detail
  const getTeacherDetail = (teacherId: string) => {
    return teachers.find(t => t.id === teacherId);
  };

  // Get roster students for selected classroom level
  const rosterStudents = useMemo(() => {
    if (!viewingRosterClass) return [];
    return students.filter(s => s.level === viewingRosterClass.level);
  }, [viewingRosterClass, students]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 print:space-y-0">
      
      {/* Official Algeria Board Header for Print */}
      <div className="hidden print:block text-right mb-8 border-b-2 border-slate-800 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-bold text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
            <h3 className="text-sm font-bold text-slate-800 mt-1">وزارة التربية الوطنية</h3>
            <h4 className="text-xs font-bold text-slate-750 mt-2">مديرية التربية لولاية باتنة</h4>
            <h4 className="text-xs font-bold text-slate-750">المدرسة الابتدائية: دراغله محمد - فم الطوب</h4>
          </div>
          <div className="text-left font-sans">
            <p className="text-xs font-bold text-slate-600">التاريخ: {new Date().toLocaleDateString('ar-DZ')}</p>
            <p className="text-xs text-slate-500 mt-1">المادة الإدارية: الفهرس العام للأقسام الدراسية</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <h1 className="text-2xl font-black text-slate-900 border-t border-b border-slate-350 py-3 inline-block px-12">
            {viewingRosterClass ? `قائمة رصيد التلاميذ: ${viewingRosterClass.name}` : 'الهيكل التنظيمي للأقسام والمستويات الدراسية'}
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-bold">
            {viewingRosterClass 
              ? `المستوى: ${viewingRosterClass.level} | الأستاذ المنسق: ${getTeacherDetail(viewingRosterClass.teacherId)?.name || 'غير معين'}`
              : `إجمالي عدد الأقسام النشطة: ${classes.length} قسم في الخدمة`
            }
          </p>
        </div>
      </div>

      {/* Stats Cards Section with custom glass touches */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="space-y-1 relative z-10">
            <p className="text-indigo-100 text-sm font-bold">إجمالي الأقسام الدراسية</p>
            <h3 className="text-3xl font-black">{statsSummary.totalClasses} أقسام</h3>
          </div>
          <div className="p-4 bg-white/15 rounded-2xl relative z-10 border border-white/10">
            <School size={28} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-100/5 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="space-y-1 relative z-10">
            <p className="text-slate-300 text-sm font-bold">متوسط استيعاب القسم</p>
            <h3 className="text-3xl font-black">{statsSummary.avgCapacity} مقعد</h3>
          </div>
          <div className="p-4 bg-white/10 rounded-2xl relative z-10 border border-white/10">
            <Layers size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-200/80 shadow-lg shadow-slate-100/40 flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="space-y-1 relative z-10">
            <p className="text-slate-400 text-sm font-bold">إجمالي مقاعد الشاغلين</p>
            <h3 className="text-3xl font-black text-slate-800">{statsSummary.totalAssignedStudents} طالب</h3>
          </div>
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl relative z-10">
            <Users size={28} />
          </div>
        </div>
      </div>

      {/* Main Section */}
      {!viewingRosterClass ? (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="البحث عن قسم..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm"
                />
              </div>

              <select
                value={selectedLevelFilter}
                onChange={(e) => setSelectedLevelFilter(e.target.value)}
                className="w-full md:w-48 px-3 py-2 bg-slate-50 border border-slate-200 border-l-8 rounded-2xl border-l-indigo-500 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-sm"
              >
                <option value="all">كل المستويات الدراسية</option>
                {Object.values(StudentLevel).map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100 font-bold text-sm active:scale-95"
              >
                <Printer size={18} />
                <span>طباعة الهيكل</span>
              </button>
              <button
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 font-bold text-sm active:scale-95"
              >
                <Plus size={18} />
                <span>إضافة قسم جديد</span>
              </button>
            </div>
          </div>

          {/* Class Card Grid with Glassmorphic design and ambient flows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative overflow-hidden pb-10">
            {/* Ambient Background glows in background representing luxury glass design */}
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-300/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-cyan-200/10 rounded-full blur-3xl pointer-events-none" />

            {filteredClasses.length > 0 ? (
              filteredClasses.map((cls) => {
                const studentCount = getClassStudentCount(cls.level);
                const teacherObj = getTeacherDetail(cls.teacherId);
                const fillsRate = Math.min(100, Math.round((studentCount / cls.capacity) * 100));

                return (
                  <div 
                    key={cls.id} 
                    className="relative z-10 bg-white/45 backdrop-blur-xl hover:bg-white/70 border border-white/60 hover:border-indigo-200 rounded-[2.5rem] p-6 shadow-xl shadow-indigo-50/20 hover:shadow-2xl hover:shadow-indigo-100/30 transition-all duration-300 flex flex-col justify-between group print:border-slate-300 print:bg-white print:shadow-none"
                  >
                    {/* Header: Name and Level tag */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="space-y-1">
                        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{cls.level}</span>
                        <h4 className="text-xl font-black text-slate-800">{cls.name}</h4>
                      </div>
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100/50">
                        <School size={20} />
                      </div>
                    </div>

                    {/* Teacher Section */}
                    <div className="p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/90 shadow-sm flex items-center gap-3 mb-5 hover:border-indigo-100 transition-colors">
                      <img 
                        src={teacherObj?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${cls.id}`} 
                        alt={teacherObj?.name || 'مدرس'} 
                        className="w-11 h-11 bg-slate-100 rounded-xl"
                      />
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold">المعلم المسؤول</p>
                        <p className="text-sm font-black text-slate-700">{teacherObj?.name || 'أستاذ غير معين'}</p>
                        {teacherObj?.subject && (
                          <span className="inline-block text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold mt-0.5">
                            {teacherObj.subject}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Density indicator / Stats progress */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>نسبة الإشغال المعتمد</span>
                        <span className={fillsRate >= 100 ? 'text-red-500' : fillsRate >= 80 ? 'text-amber-500' : 'text-indigo-600'}>
                          {studentCount} / {cls.capacity} مقعد ({fillsRate}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100/70 rounded-full overflow-hidden border border-slate-200/20">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            fillsRate >= 100 ? 'bg-gradient-to-l from-red-500 to-red-400' : 
                            fillsRate >= 80 ? 'bg-gradient-to-l from-amber-500 to-amber-400' : 
                            'bg-gradient-to-l from-indigo-500 to-indigo-400'
                          }`}
                          style={{ width: `${fillsRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100/50 flex justify-between items-center print:hidden">
                      <button
                        onClick={() => setViewingRosterClass(cls)}
                        className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 font-black"
                      >
                        <Users2 size={16} />
                        <span>عرض قائمة التلاميذ</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(cls)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-all"
                          title="تعديل"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cls)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white rounded-[2rem] p-12 text-center text-slate-400 border border-slate-200">
                <School size={48} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-lg font-bold">لا توجد أقسام مسجلة مسبقاً</h3>
                <p className="text-sm text-slate-400 mt-1">يمكنك إضافة قسم جديد يطابق مستواك من خلال النقر على زر الإضافة أعلاه.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Classroom Student Roster details view */
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setViewingRosterClass(null)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="رجوع للأقسام"
              >
                <ArrowRight size={22} />
              </button>
              <div>
                <h2 className="text-xl font-black text-slate-800">{viewingRosterClass.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">قائمة التلاميذ والمستويات المسجلة في {viewingRosterClass.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-md shadow-emerald-50 active:scale-95 whitespace-nowrap"
              >
                <Printer size={18} />
                <span>تحميل / طباعة القائمة</span>
              </button>
              <button
                onClick={() => setViewingRosterClass(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-bold transition-all"
              >
                رجوع
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
            {rosterStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 print:bg-slate-100">
                      <th className="px-8 py-5 print:py-3 print:px-4">الطالب</th>
                      <th className="px-8 py-5 print:py-3 print:px-4">ولي الأمر</th>
                      <th className="px-8 py-5 print:py-3 print:px-4">رقم الهاتف</th>
                      <th className="px-8 py-5 print:py-3 print:px-4">تاريخ الميلاد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 print:divide-y print:divide-slate-300">
                    {rosterStudents.map((stud) => (
                      <tr key={stud.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap flex items-center gap-3">
                          <img 
                            src={stud.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${stud.id}`} 
                            alt={stud.name} 
                            className="w-10 h-10 rounded-xl bg-slate-100 print:hidden"
                          />
                          <div>
                            <p className="text-sm font-black text-slate-800">{stud.name}</p>
                            <span className="text-[10px] text-slate-400 font-mono" dir="ltr">ID: {stud.id}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-bold text-slate-600">
                          {stud.parentName}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-mono text-slate-500" dir="ltr">
                          {stud.phone}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-500">
                          {stud.birthDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Users className="mx-auto text-slate-300 mb-3" size={44} />
                <h3 className="text-lg font-bold">لا يوجد طلاب مسجلون حالياً</h3>
                <p className="text-sm text-slate-400 mt-1">لم يتم العثور على أي طالب مسجل في مستوى "{viewingRosterClass.level}".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CLASSROOM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300 print:hidden">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
                  <School size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">{editingClass ? 'تعديل بيانات القسم' : 'إضافة قسم جديد'}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">أدخل تفاصيل الهيكل الدراسي لتهيئة الحجرة</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 block">اسم القسم الفوجي</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: القسم 4أ، السنة الثالثة الفوج ج..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 block">المستوى التربوي</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as StudentLevel })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                >
                  {Object.values(StudentLevel).map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 block">الأستاذ المنسق أو المشرف</label>
                <select
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                >
                  <option value="">بدون مدرس حالياً</option>
                  {teachers.map((teach) => (
                    <option key={teach.id} value={teach.id}>
                      {teach.name} ({teach.subject || 'التعليم العام'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 block">أقصى طاقة استيعاب</label>
                <input
                  type="number"
                  min="10"
                  max="50"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all text-sm"
                >
                  إلغاء المعاينة
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all text-sm shadow-md shadow-indigo-150 active:scale-95"
                >
                  {editingClass ? 'حفظ التغييرات' : 'إضافة الفصيلة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300 print:hidden">
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle size={30} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">حذف القسم الدراسي؟</h3>
                <p className="text-sm text-slate-500">
                  هل أنت متأكد من رغبتك في حذف القسم <strong className="text-slate-800 font-black">"{classToDelete?.name}"</strong>؟ لا يمكن التراجع عن هذا الإجراء لاحقاً.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md shadow-red-100/30"
              >
                تأكيد حذف القسم
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClassList;

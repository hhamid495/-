import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Plus, Edit, Trash2, X, User, Phone, 
  Calendar, GraduationCap, Users, AlertTriangle, Check,
  ChevronLeft, ChevronRight, UserPlus, Printer, Archive,
  RefreshCw, FileText, ArrowLeftRight, Award, ShieldAlert,
  SearchCode, BadgeAlert, Sparkles, BookOpen
} from 'lucide-react';
import { MOCK_STUDENTS } from '../constants';
import { Student, StudentLevel, ArchivedStudent } from '../types';

const DEFAULT_ARCHIVED_STUDENTS: ArchivedStudent[] = [
  {
    id: 'S9851',
    name: 'سامي بوقرة',
    level: StudentLevel.LEVEL_5,
    parentName: 'عبد الحميد بوقرة',
    phone: '0661998877',
    birthDate: '2013-04-12',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sami',
    archiveStatus: 'graduated',
    archiveDate: '2025-06-22',
    archiveReason: 'إتمام مرحلة التعليم الابتدائي بنجاح بمعدل 8.75/10 والتمدرس بامتياز',
    archiveNotes: 'طالب مواظب من أوائل المدرسة؛ تمنياتنا له بمستقبل زاهر وتوفيق دائم في الطور المتوسط.',
    performance: [
      { label: 'اللغة العربية', score: 92 },
      { label: 'الرياضيات', score: 88 },
      { label: 'اللغة الفرنسية', score: 85 }
    ]
  },
  {
    id: 'S3054',
    name: 'خلود مقدّم',
    level: StudentLevel.LEVEL_3,
    parentName: 'توفيق مقدّم',
    phone: '0554124578',
    birthDate: '2015-11-02',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kholoud',
    archiveStatus: 'transferred',
    archiveDate: '2025-10-15',
    archiveReason: 'الانتقال إلى المدرسة الابتدائية "ابن رشد" بولاية سطيف إثر تحول مقر إقامة العائلة',
    archiveNotes: 'تم سليم نسخة من الشهادة المدرسية والملف الصحي والأكاديمي للولي بطلب منه ممهوراً بالإرسال المدرسي.',
    performance: [
      { label: 'اللغة العربية', score: 80 },
      { label: 'الرياضيات', score: 75 },
      { label: 'السلوك', score: 90 }
    ]
  }
];

const StudentList: React.FC = () => {
  // --- Active Students State ---
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('madarisi_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  // --- Archived Students State ---
  const [archivedStudents, setArchivedStudents] = useState<ArchivedStudent[]>(() => {
    const saved = localStorage.getItem('madarisi_archived_students');
    return saved ? JSON.parse(saved) : DEFAULT_ARCHIVED_STUDENTS;
  });

  // Keep both persisted locally
  useEffect(() => {
    localStorage.setItem('madarisi_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('madarisi_archived_students', JSON.stringify(archivedStudents));
  }, [archivedStudents]);

  // --- Layout & Filter States ---
  const [activeSegment, setActiveSegment] = useState<'active' | 'archived'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // --- Modals States ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [studentToArchive, setStudentToArchive] = useState<Student | null>(null);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [selectedCertStudent, setSelectedCertStudent] = useState<ArchivedStudent | null>(null);

  const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] = useState(false);
  const [archivedStudentToDelete, setArchivedStudentToDelete] = useState<ArchivedStudent | null>(null);

  // --- Form States (Add Student) ---
  const [formData, setFormData] = useState({
    name: '',
    level: StudentLevel.LEVEL_1,
    parentName: '',
    phone: '',
    birthDate: '',
  });

  // --- Form States (Archive Process) ---
  const [archiveForm, setArchiveForm] = useState({
    status: 'graduated' as 'graduated' | 'transferred' | 'other',
    date: '2026-06-04', // Matches system local date 2026
    reason: '',
    notes: '',
  });

  // --- Computed Stats ---
  const stats = useMemo(() => {
    const activeCount = students.length;
    const archivedCount = archivedStudents.length;
    const graduatedCount = archivedStudents.filter(s => s.archiveStatus === 'graduated').length;
    const transferredCount = archivedStudents.filter(s => s.archiveStatus === 'transferred').length;
    return { activeCount, archivedCount, graduatedCount, transferredCount };
  }, [students, archivedStudents]);

  // --- Filter Logic ---
  const filteredActiveStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === 'all' || student.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [students, searchTerm, levelFilter]);

  const filteredArchivedStudents = useMemo(() => {
    return archivedStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            student.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === 'all' || student.level === levelFilter;
      const matchesStatus = statusFilter === 'all' || student.archiveStatus === statusFilter;
      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [archivedStudents, searchTerm, levelFilter, statusFilter]);

  // --- Handlers for Active Students ---
  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      id: `S${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}${Math.random()}`,
      performance: [
        { label: 'اللغة العربية', score: Math.floor(70 + Math.random() * 25) },
        { label: 'الرياضيات', score: Math.floor(65 + Math.random() * 30) },
        { label: 'السلوك', score: Math.floor(80 + Math.random() * 20) }
      ]
    };
    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
    resetAddForm();
  };

  const resetAddForm = () => {
    setFormData({
      name: '',
      level: StudentLevel.LEVEL_1,
      parentName: '',
      phone: '',
      birthDate: '',
    });
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteActive = () => {
    if (studentToDelete) {
      setStudents(students.filter(s => s.id !== studentToDelete.id));
      setIsDeleteModalOpen(false);
      setStudentToDelete(null);
    }
  };

  // --- Handlers for Archiving (Moving active -> archive) ---
  const handleArchiveClick = (student: Student) => {
    setStudentToArchive(student);
    // Autofill defaults if needed based on state
    setArchiveForm({
      status: 'graduated',
      date: new Date().toISOString().substring(0, 10),
      reason: student.level === StudentLevel.LEVEL_5 ? 'إتمام مرحلة التعليم الابتدائي بنجاح والتخرج' : 'تغيير مقر السكن والانتقال لمدرسة أخرى',
      notes: '',
    });
    setIsArchiveModalOpen(true);
  };

  const confirmArchive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToArchive) return;

    const archivedRecord: ArchivedStudent = {
      ...studentToArchive,
      archiveStatus: archiveForm.status,
      archiveDate: archiveForm.date,
      archiveReason: archiveForm.reason || (archiveForm.status === 'graduated' ? 'تخرج للطور المتوسط' : 'نقل إلى مدرسة أخرى'),
      archiveNotes: archiveForm.notes,
      previousClass: studentToArchive.level
    };

    // Remove from active
    setStudents(students.filter(s => s.id !== studentToArchive.id));
    // Add to archive
    setArchivedStudents([archivedRecord, ...archivedStudents]);
    
    setIsArchiveModalOpen(false);
    setStudentToArchive(null);
  };

  // --- Handlers for Archived Students ---
  const handleRestoreClick = (record: ArchivedStudent) => {
    // Return student to active list
    const activeRecord: Student = {
      id: record.id,
      name: record.name,
      level: record.previousClass as StudentLevel || record.level,
      parentName: record.parentName,
      phone: record.phone,
      birthDate: record.birthDate,
      photo: record.photo,
      performance: record.performance
    };

    // Remove from archive
    setArchivedStudents(archivedStudents.filter(s => s.id !== record.id));
    // Insert into active
    setStudents([activeRecord, ...students]);
  };

  const handlePermanentDeleteClick = (record: ArchivedStudent) => {
    setArchivedStudentToDelete(record);
    setIsPermanentDeleteModalOpen(true);
  };

  const confirmPermanentDelete = () => {
    if (archivedStudentToDelete) {
      setArchivedStudents(archivedStudents.filter(s => s.id !== archivedStudentToDelete.id));
      setIsPermanentDeleteModalOpen(false);
      setArchivedStudentToDelete(null);
    }
  };

  const viewCertificate = (record: ArchivedStudent) => {
    setSelectedCertStudent(record);
    setIsCertModalOpen(true);
  };

  const printCertificate = () => {
    const printContent = document.getElementById('printable-discharge-cert');
    if (!printContent) return;
    const originalContent = document.body.innerHTML;
    
    // Simple window printing approach
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 print:space-y-0">
      
      {/* Official School Header - Only visible during print */}
      <div className="hidden print:block text-right mb-8 border-b-2 border-slate-800 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-bold text-slate-800">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
            <h3 className="text-sm font-bold text-slate-800 mt-1">وزارة التربية الوطنية</h3>
            <h4 className="text-xs font-bold text-slate-700 mt-2">مديرية التربية لولاية باتنة</h4>
            <h4 className="text-xs font-bold text-slate-700">المدرسة الابتدائية: دراغله محمد - فم الطوب</h4>
          </div>
          <div className="text-left font-sans">
            <p className="text-xs font-bold text-slate-600">التاريخ: {new Date().toLocaleDateString('ar-DZ')}</p>
            <p className="text-xs text-slate-500 mt-1">المصلحة: مديرية شؤون الطلاب</p>
          </div>
        </div>
        <div className="text-center mt-6">
          <h1 className="text-2xl font-black text-slate-900 border-t border-b border-slate-500 py-3 inline-block px-12">
            {activeSegment === 'active' ? 'قائمة أولياء الطلاب المقيدين دورياً' : 'سجل أرشيف البيانات للطلاب المتخرجين والمنقولين'}
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 font-bold">
            عدد التلاميذ المسجلين في هذا التقرير: {activeSegment === 'active' ? filteredActiveStudents.length : filteredArchivedStudents.length} طالباً
          </p>
        </div>
      </div>

      {/* --- Administrative Interactive Badges / Stats --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase">الطلاب الحاليون</span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.activeCount}</h3>
          </div>
          <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase">المتخرجون المؤرشفون</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.graduatedCount}</h3>
          </div>
          <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100">
            <Award size={20} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase">الطلاب المنقولون</span>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.transferredCount}</h3>
          </div>
          <div className="p-3 bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-100">
            <ArrowLeftRight size={20} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-black text-slate-400 uppercase">إجمالي المحفوظات</span>
            <h3 className="text-2xl font-black text-slate-700 mt-1">{stats.archivedCount}</h3>
          </div>
          <div className="p-3 bg-slate-700 text-white rounded-xl shadow-lg shadow-slate-100">
            <Archive size={20} />
          </div>
        </div>
      </div>

      {/* --- Filter & Segment Controller Navigation Bar --- */}
      <div className="bg-white rounded-[2rem] border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center p-4 gap-4 justify-between print:hidden">
        {/* Toggle Segment */}
        <div className="bg-slate-100 p-1 rounded-2xl flex w-full md:w-auto">
          <button
            onClick={() => { setActiveSegment('active'); setSearchTerm(''); }}
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
              activeSegment === 'active' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users size={16} />
            <span>الطلاب النشطون ({stats.activeCount})</span>
          </button>
          <button
            onClick={() => { setActiveSegment('archived'); setSearchTerm(''); }}
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
              activeSegment === 'archived' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Archive size={16} />
            <span>سجل الأرشيف الخارجي ({stats.archivedCount})</span>
          </button>
        </div>

        {/* Dynamic Controls based on Segment */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative flex-1 sm:flex-initial sm:w-60">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder={activeSegment === 'active' ? 'ابحث في الطلاب النشطين...' : 'اسم المحفوظ أو معرّفه الرقمي...'}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="all">الأطوار: الكل</option>
            {Object.values(StudentLevel).map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>

          {activeSegment === 'archived' && (
            <select
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">نوع الأرشيف: الكل</option>
              <option value="graduated">متخرج</option>
              <option value="transferred">منقول</option>
              <option value="other">آخر</option>
            </select>
          )}

          {activeSegment === 'active' ? (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-all font-black text-sm active:scale-95 shadow-sm shadow-indigo-100"
            >
              <Plus size={18} />
              <span>تسجيل طالب</span>
            </button>
          ) : (
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-emerald-650 text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl transition-all font-black text-sm active:scale-95 shadow-sm shadow-emerald-100"
            >
              <Printer size={18} />
              <span>طباعة السجل المؤرشف</span>
            </button>
          )}
        </div>
      </div>

      {/* --- Main Table Card Layout --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xs border border-slate-200 overflow-hidden print:border-none print:shadow-none print:bg-white">
        
        {activeSegment === 'active' ? (
          // ================== ACTIVE STUDENTS VIEW ==================
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100 print:bg-slate-100 print:text-slate-800">
                    <th className="px-8 py-5 print:py-3 print:px-4">ملف التلميذ</th>
                    <th className="px-8 py-5 print:py-3 print:px-4">السنة والمستوى</th>
                    <th className="px-8 py-5 print:py-3 print:px-4">ولي أمر الطالب والمشرف</th>
                    <th className="px-8 py-5 text-center print:hidden">إجراءات المراقبة والأرشفة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-y print:divide-slate-350">
                  {filteredActiveStudents.length > 0 ? (
                    filteredActiveStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-indigo-50/20 transition-all group">
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <img src={student.photo} alt="" className="w-12 h-12 rounded-2xl object-cover ring-4 ring-white shadow-md group-hover:scale-105 transition-transform" />
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 text-base">{student.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">معرف التسجيل: {student.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black border border-indigo-100">
                            {student.level}
                          </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-slate-700 font-black text-sm">{student.parentName}</span>
                            <span className="text-slate-450 text-xs font-mono text-slate-400" dir="ltr">{student.phone}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap print:hidden">
                          <div className="flex items-center justify-center gap-2">
                            {/* Archive Studen Button - High Fidelity Action */}
                            <button 
                              onClick={() => handleArchiveClick(student)}
                              title="أرشفة السجل وتعديل وضعية التمدرس"
                              className="flex items-center gap-1 px-3 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all font-bold text-xs"
                            >
                              <Archive size={14} />
                              <span>أرشفة (تخرج/نقل)</span>
                            </button>

                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all shadow-xs border border-transparent">
                              <Edit size={16} />
                            </button>
                            
                            <button 
                              onClick={() => handleDeleteClick(student)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-xs border border-transparent"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center">
                        <div className="max-w-sm mx-auto flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                            <Users size={28} />
                          </div>
                          <p className="text-slate-500 font-bold">لا يوجد طلاب نشطين يطابقون خيارات البحث الحالية.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
              <p className="text-sm font-bold text-slate-500">
                عرض <span className="text-indigo-600">{filteredActiveStudents.length}</span> من أصل <span className="text-slate-800">{students.length}</span> طالب نشط
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-35" disabled>
                  <ChevronRight size={20} />
                </button>
                <div className="flex gap-1">
                  <button className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-100 text-sm">١</button>
                </div>
                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-35" disabled>
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          // ================== ARCHIVED STUDENTS VIEW ==================
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-100 print:bg-slate-100 print:text-slate-800">
                    <th className="px-8 py-5 print:py-3 print:px-4">الطالب المنسحب</th>
                    <th className="px-8 py-5 print:py-3 print:px-4">آخر مستوى دراسي</th>
                    <th className="px-8 py-5 print:py-3 print:px-4">حالة وسبب الأرشفة</th>
                    <th className="px-8 py-5 print:py-4 print:px-4">تاريخ الشطب</th>
                    <th className="px-8 py-5 text-center print:hidden">التحكّم والإجراءات الإدارية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredArchivedStudents.length > 0 ? (
                    filteredArchivedStudents.map((record) => (
                      <tr key={record.id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <img src={record.photo} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs grayscale group-hover:grayscale-0 transition-all" />
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 text-base">{record.name}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">سجل أرشيف: {record.id}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                            {record.previousClass || record.level}
                          </span>
                        </td>

                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1 max-w-sm">
                            <div className="flex items-center gap-2">
                              {record.archiveStatus === 'graduated' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-xs font-black border border-emerald-100">
                                  <Award size={12} />
                                  <span>تخرّج بنجاح</span>
                                </span>
                              ) : record.archiveStatus === 'transferred' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-black border border-amber-100">
                                  <ArrowLeftRight size={12} />
                                  <span>انتقال خارجي</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-black border border-slate-200">
                                  <ShieldAlert size={12} />
                                  <span>شطب إداري</span>
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 font-medium text-xs break-words line-clamp-2 leading-relaxed mt-1" title={record.archiveReason}>
                              {record.archiveReason}
                            </p>
                          </div>
                        </td>

                        <td className="px-8 py-5 whitespace-nowrap">
                          <div className="flex flex-col text-xs">
                            <span className="font-mono text-slate-700 font-bold">{record.archiveDate}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">بقرار الإدارة</span>
                          </div>
                        </td>

                        <td className="px-8 py-5 whitespace-nowrap print:hidden">
                          <div className="flex items-center justify-center gap-2">
                            {/* Certificate view and Print document */}
                            <button 
                              onClick={() => viewCertificate(record)}
                              className="px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl transition-all text-xs font-black flex items-center gap-1"
                            >
                              <FileText size={14} />
                              <span>الوثيقة الإدارية</span>
                            </button>

                            {/* Restore to Active List button */}
                            <button
                              onClick={() => handleRestoreClick(record)}
                              title="إلغاء الأرشفة وإعادة التلميذ للتمدرس النشط"
                              className="px-3 py-2 bg-slate-100 hover:bg-indigo-650 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-xl transition-all text-xs font-black flex items-center gap-1"
                            >
                              <RefreshCw size={12} />
                              <span>إرجاع للنشط</span>
                            </button>

                            {/* Permanent Delete */}
                            <button 
                              onClick={() => handlePermanentDeleteClick(record)}
                              title="حذف البيانات نهائياً من الأرشيف"
                              className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-16 text-center">
                        <div className="max-w-sm mx-auto flex flex-col items-center">
                          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                            <Archive size={28} />
                          </div>
                          <p className="text-slate-500 font-bold">لم يتم العثور على أي بيانات مسجلة في الأرشيف يطابق خياراتك.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-slate-150 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/20">
              <p className="text-sm font-bold text-slate-500">
                عرض <span className="text-indigo-600">{filteredArchivedStudents.length}</span> من أصل <span className="text-slate-800">{archivedStudents.length}</span> طالب ضمن الأرشيف
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-35" disabled>
                  <ChevronRight size={20} />
                </button>
                <div className="flex gap-1">
                  <button className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl font-black shadow-lg shadow-indigo-100 text-sm">١</button>
                </div>
                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-all disabled:opacity-35" disabled>
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================== MODAL: ARCHIVE STUDENT ACTION ================== */}
      {isArchiveModalOpen && studentToArchive && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <Archive size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">أرشفة سجل طالب وإخراجه</h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">نقل السجل المدرسي للطالب إلى قاعدة المحفوظات</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsArchiveModalOpen(false); setStudentToArchive(null); }} 
                className="p-2.5 bg-white text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm transition-all hover:rotate-95"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={confirmArchive} className="p-8 space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex items-center gap-4">
                <img src={studentToArchive.photo} alt="" className="w-12 h-12 rounded-xl bg-white border object-cover" />
                <div>
                  <h4 className="font-black text-slate-800 text-sm">{studentToArchive.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    القسم الحالي: {studentToArchive.level} | الولي: {studentToArchive.parentName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 animate-pulse-once">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    سبب وعنوان الترحيل
                  </label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-550 focus:border-indigo-500 outline-none transition-all font-bold text-sm text-slate-700"
                    value={archiveForm.status}
                    onChange={(e) => setArchiveForm({ ...archiveForm, status: e.target.value as any })}
                  >
                    <option value="graduated">تخرج بنجاح (المستوى الخامس للأعوام المقيدة)</option>
                    <option value="transferred">انتقال خارجي لمدرسة أخرى (تغيير الإقامة)</option>
                    <option value="other">شطب لغرض آخر (توقف، فصل، إلخ)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    تاريخ سريان قرار الشطب
                  </label>
                  <input 
                    required 
                    type="date" 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-550 outline-none transition-all font-bold text-sm text-slate-700"
                    value={archiveForm.date}
                    onChange={(e) => setArchiveForm({ ...archiveForm, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  السبب التفصيلي (يكتب في الشهادة الإدارية)
                </label>
                <input 
                  required 
                  type="text" 
                  placeholder={archiveForm.status === 'graduated' ? 'مثال: إنهاء مرحلة التعليم الأساسي الابتدائي بمعدل ممتاز' : 'مثال: انتقال إلى المدرسة الابتدائية السلام بباتنة'}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-550 outline-none transition-all font-bold text-sm text-slate-700"
                  value={archiveForm.reason}
                  onChange={(e) => setArchiveForm({ ...archiveForm, reason: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  ملاحظات إضافية (خاصة بإدارة المؤسسة)
                </label>
                <textarea 
                  rows={2}
                  placeholder="ملاحظات سرية حول التلميذ أو تفاصيل تسليم وثائقه الدراسية لولي أمره..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-550 outline-none transition-all font-medium text-sm text-slate-700 resize-none"
                  value={archiveForm.notes}
                  onChange={(e) => setArchiveForm({ ...archiveForm, notes: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button type="submit" className="flex-1 bg-indigo-650 bg-indigo-600 text-white py-4 rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                  حفظ في الأرشيف وشطب الطالب
                </button>
                <button 
                  type="button" 
                  onClick={() => { setIsArchiveModalOpen(false); setStudentToArchive(null); }} 
                  className="px-6 py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-sm hover:bg-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================== MODAL: PREVIEW DISCHARGE CERTIFICATE (وثيقة الشطب والتخرج) ================== */}
      {isCertModalOpen && selectedCertStudent && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden border border-white/20 print:p-0 print:m-0 print:border-none print:shadow-none">
            {/* Modal Actions Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden">
              <div className="flex items-center gap-2 text-slate-800">
                <FileText size={22} className="text-emerald-600" />
                <h3 className="text-lg font-black">معاينة الوثيقة الإدارية الرسمية</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={printCertificate}
                  className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-sm"
                >
                  <Printer size={15} />
                  <span>طباعة الشهادة الرسمية</span>
                </button>
                <button 
                  onClick={() => { setIsCertModalOpen(false); setSelectedCertStudent(null); }} 
                  className="p-2 bg-white text-slate-400 hover:text-slate-600 rounded-xl border transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Certificate Layout Screen */}
            <div className="p-8 font-sans bg-amber-50/5/10 print:bg-white max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div 
                id="printable-discharge-cert" 
                className="bg-white p-8 border-[6px] border-double border-slate-800 rounded-2xl relative shadow-inner font-sans text-right text-slate-900 leading-relaxed print:border-slate-950 print:p-4 print:shadow-none"
                style={{ direction: 'rtl' }}
              >
                {/* Official Country Heading */}
                <div className="text-center space-y-1">
                  <h2 className="text-sm font-bold tracking-normal text-slate-900">الجمهورية الجزائرية الديمقراطية الشعبية</h2>
                  <h2 className="text-xs font-bold tracking-normal text-slate-800">وزارة التربية الوطنية</h2>
                  <h3 className="text-xs font-medium text-slate-700">مديرية التربية لولاية باتنة - المدرسة الابتدائية: دراغله محمد بفم الطوب</h3>
                  <div className="w-24 h-0.5 bg-slate-450 bg-slate-800 mx-auto my-3"></div>
                </div>

                {/* Sub Metadata info */}
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 mt-4 px-2">
                  <span>رقم السجل: ARCH-{selectedCertStudent.id}</span>
                  <span>فم الطوب في: {selectedCertStudent.archiveDate}</span>
                </div>

                {/* Main Title Badge */}
                <div className="text-center my-6">
                  <h1 className="text-2xl font-black text-slate-900 border-2 border-slate-900 bg-slate-50 px-8 py-2.5 inline-block rounded-xl print:text-xl">
                    {selectedCertStudent.archiveStatus === 'graduated' ? 'شهادة نجاح وتخرج مدرسية' : 'شهادة شطب وانتقال مدرسية'}
                  </h1>
                </div>

                {/* Certificate Core Statement Body */}
                <div className="my-8 text-sm md:text-base space-y-4 px-2 font-medium">
                  <p>
                    يشهد مدير المدرسة الابتدائية <span className="font-black underline">"دراغله محمد"</span> التابعة لمندوبية فم الطوب، بأنه طبقاً للسجلات الرسمية المحفوظة في أرشيفات المؤسسة المدرسية:
                  </p>
                  
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-dotted border-slate-400 space-y-2 mt-4">
                    <p>أن الطالب(ة): <span className="font-black text-lg text-slate-900">{selectedCertStudent.name}</span></p>
                    <p>تاريخ ومكان الميلاد: <span className="font-bold">{selectedCertStudent.birthDate} بفم الطوب</span></p>
                    <p>اسم ولي الأمر القانوني: <span className="font-bold">{selectedCertStudent.parentName}</span></p>
                    <p>آخر طور مسجل به في المدرسة: <span className="font-bold">{selectedCertStudent.previousClass || selectedCertStudent.level}</span></p>
                  </div>

                  <p className="indent-8 text-slate-850 pt-2 leading-relaxed">
                    وبناءً على ذلك، تقيد السجلات بأن الطالب المذكور أعلاه قد تـم <span className="font-black text-red-700 underline">شطبه نهائياً</span> من القوائم الاسمية للمؤسسة النشطة، وتبويب بياناته الأكاديمية ضمن سجل الأرشيف الدائم تحت بند <span className="font-bold">"{selectedCertStudent.archiveStatus === 'graduated' ? 'إتمام الدراسة والتخرج للمرحلة المتوسطة' : selectedCertStudent.archiveStatus === 'transferred' ? 'الانتقال إلى مدرسة أخرى' : 'أخرى'}"</span>، وذلك للسبب المكتوب إدارياً:
                  </p>

                  <p className="bg-amber-50/30 p-3 rounded-lg border-r-4 border-amber-500 font-bold text-slate-800 text-sm italic">
                    "{selectedCertStudent.archiveReason}"
                  </p>

                  {selectedCertStudent.performance && selectedCertStudent.performance.length > 0 && (
                    <div className="mt-5">
                      <p className="text-xs font-black text-slate-500 mb-2">كشف العلامات المحفوظ للأطوار النهائية بملف الطالب:</p>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        {selectedCertStudent.performance.map((perf, i) => (
                          <div key={i} className="bg-slate-50 p-2 rounded border border-slate-200">
                            <span className="block text-[10px] text-slate-500 font-bold">{perf.label}</span>
                            <span className="font-black text-slate-800 mt-0.5 block">{perf.score} / ١٠</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCertStudent.archiveNotes && (
                    <div className="text-xs text-slate-500 font-bold bg-slate-50 p-3 rounded-lg border-l-2 border-slate-300 mt-2">
                      ملاحظة إدارية ملحقة: {selectedCertStudent.archiveNotes}
                    </div>
                  )}

                  <p className="text-xs font-medium text-slate-650 leading-relaxed text-slate-500 pt-3">
                    ملاحظة: سُلّمت هذه الشهادة لولي الأمر المعني قانوناً لاستعمالها في تبرير المسار الدراسي وتسهيل عملية التسجيل بالمؤسسات المضيفة ولا تسقط صلاحيتها الأرشيفية.
                  </p>
                </div>

                {/* Directors Sign block and Stamp placeholder */}
                <div className="mt-12 flex justify-between items-center px-4 font-bold">
                  <div className="text-center w-48 text-xs text-slate-400 border border-slate-100 rounded-lg py-4 border-dashed relative">
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-350 transform rotate-12 font-black uppercase">
                      ختم المؤسسة المدرسية الرسمي
                    </span>
                  </div>
                  
                  <div className="text-center text-sm">
                    <p className="text-slate-800 underline underline-offset-4 font-black">مدير المدرسة الابتدائية</p>
                    <p className="text-xs font-mono text-slate-500 mt-1">أحمد بن منصور</p>
                    {/* Visual Stamp Line */}
                    <div className="mt-2 text-[10px] font-sans text-indigo-800 border border-indigo-200 inline-block px-3 py-1 rounded bg-indigo-50/20 antialiased transform rotate-2">
                       توقيع وإمضاء الكتروني
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================== MODAL: DELETE ACTIVE CONFIRMATION ================== */}
      {isDeleteModalOpen && studentToDelete && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200 overflow-hidden border border-white/20">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-red-50/50">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">شطب وحذف الطالب نهائياً</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                هل أنت متأكد من رغبتك في حذف ملف الطالب <span className="font-black text-red-600 underline">"{studentToDelete.name}"</span>؟ 
                <br />
                <span className="text-xs text-amber-600 font-bold mt-1 block">ملاحظة: يمكنك أرشفته والاحتفاظ بملفه بدلاً عن الحذف النهائي!</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={confirmDeleteActive} 
                  className="flex-1 bg-red-600 text-white py-3.5 rounded-xl font-black hover:bg-red-700 shadow-md active:scale-95 order-2 sm:order-1 text-sm"
                >
                  نعم، حذف نهائي
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(false)} 
                  className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-black hover:bg-slate-200 active:scale-95 order-1 sm:order-2 text-sm"
                >
                  إلغاء وتراجع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================== MODAL: PERMANENT ARCHIVE DELETE CONFIRMATION ================== */}
      {isPermanentDeleteModalOpen && archivedStudentToDelete && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200 overflow-hidden border border-white/20">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-red-100 text-red-650 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-red-50/55">
                <BadgeAlert size={40} />
              </div>
              <h3 className="text-2xl font-black text-red-800 mb-2">إزالة نهائية من سجل الأرشيف</h3>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                تفقد الملف المدرسي المؤرشف للطالب <span className="font-black text-red-650 text-red-600">"{archivedStudentToDelete.name}"</span>. 
                <br />
                هل أنت متأكد من مسح سجله المحفوظ نهائياً؟ هذا الإجراء لا يمكن الرجوع عنه أبداً وتفقد المؤسسة سجلاته المقيدة.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={confirmPermanentDelete} 
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 text-white py-3.5 rounded-xl font-black hover:opacity-90 shadow-md active:scale-95 order-2 sm:order-1 text-sm"
                >
                  حذف تام ونهائي
                </button>
                <button 
                  onClick={() => setIsPermanentDeleteModalOpen(false)} 
                  className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-black hover:bg-slate-200 active:scale-95 order-1 sm:order-2 text-sm"
                >
                  إلغاء التراجع
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================== MODAL: REGISTER ACTIVE STUDENT ================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <UserPlus size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">تسجيل طالب جديد في المؤسسة</h3>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="p-2.5 bg-white text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm transition-all hover:rotate-90"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddNewStudent} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} className="text-indigo-500" /> الاسم الكامل للطالب
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="أدخل الاسم واللقب..." 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-550/10 focus:border-indigo-500 outline-none transition-all font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap size={14} className="text-indigo-500" /> الطور والمستوى الأكاديمي
                  </label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-550/10 focus:border-indigo-500 outline-none transition-all font-bold"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as StudentLevel })}
                  >
                    {Object.values(StudentLevel).map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <User size={14} className="text-indigo-500" /> اسم ولي الأمر وعلاقته
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="أدخل اسم ولي الأمر القانوني..." 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-550/10 focus:border-indigo-500 outline-none transition-all font-bold"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={14} className="text-indigo-500" /> رقم الهاتف للتواصل الطوارئ
                  </label>
                  <input 
                    required 
                    type="tel" 
                    placeholder="05XXXXXXXX" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-550/10 focus:border-indigo-500 outline-none transition-all font-bold text-left" 
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={14} className="text-indigo-500" /> تاريخ الميلاد
                </label>
                <input 
                  required 
                  type="date" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-550/10 focus:border-indigo-500 outline-none transition-all font-bold"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button type="submit" className="flex-1 bg-indigo-650 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95">تسجيل الطالب</button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black hover:bg-slate-200 transition-all active:scale-95">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentList;


import { Student, Teacher, StudentLevel, ClassRoom } from './types';

export const MOCK_STUDENTS: Student[] = [
  { 
    id: '1', 
    name: 'أحمد محمد', 
    level: StudentLevel.LEVEL_1, 
    parentName: 'محمد علي', 
    phone: '0555123456', 
    birthDate: '2017-05-12', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    performance: [
      { label: 'اللغة العربية', score: 85 },
      { label: 'الرياضيات', score: 92 },
      { label: 'السلوك', score: 95 }
    ]
  },
  { 
    id: '2', 
    name: 'فاطمة الزهراء', 
    level: StudentLevel.LEVEL_3, 
    parentName: 'عمر خالد', 
    phone: '0666123456', 
    birthDate: '2015-08-20', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    performance: [
      { label: 'اللغة العربية', score: 90 },
      { label: 'الرياضيات', score: 78 },
      { label: 'السلوك', score: 88 }
    ]
  },
  { 
    id: '3', 
    name: 'ياسين بن علي', 
    level: StudentLevel.LEVEL_5, 
    parentName: 'كمال بن علي', 
    phone: '0777123456', 
    birthDate: '2013-02-15', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yassin',
    performance: [
      { label: 'اللغة العربية', score: 75 },
      { label: 'الرياضيات', score: 85 },
      { label: 'اللغة الفرنسية', score: 80 },
      { label: 'السلوك', score: 82 }
    ]
  },
  { 
    id: '4', 
    name: 'مريم الصالح', 
    level: StudentLevel.LEVEL_2, 
    parentName: 'صالح بوعلام', 
    phone: '0555987654', 
    birthDate: '2016-11-30', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariem',
    performance: [
      { label: 'اللغة العربية', score: 95 },
      { label: 'الرياضيات', score: 96 },
      { label: 'السلوك', score: 98 }
    ]
  },
  { 
    id: '5', 
    name: 'سارة لعمري', 
    level: StudentLevel.LEVEL_1, 
    parentName: 'رشيد لعمري', 
    phone: '0555334455', 
    birthDate: '2017-08-10', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
    performance: [
      { label: 'اللغة العربية', score: 70 },
      { label: 'الرياضيات', score: 65 },
      { label: 'السلوك', score: 90 }
    ]
  },
  { 
    id: '6', 
    name: 'يوسف بلقاسم', 
    level: StudentLevel.LEVEL_3, 
    parentName: 'مراد بلقاسم', 
    phone: '0666223344', 
    birthDate: '2015-03-25', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yousef',
    performance: [
      { label: 'اللغة العربية', score: 82 },
      { label: 'الرياضيات', score: 88 },
      { label: 'السلوك', score: 85 }
    ]
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  { 
    id: 'T101', 
    name: 'أستاذ بوعلام', 
    subject: 'اللغة العربية', 
    email: 'boualam@school.dz', 
    phone: '0544112233', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Boualam', 
    registrationDate: '2022-09-01',
    rating: 4.8,
    performance: [
      { label: 'التمكن العلمي', score: 95 },
      { label: 'إدارة القسم', score: 88 },
      { label: 'التواصل مع الأولياء', score: 92 }
    ],
    notes: 'أستاذ متميز، يهتم جداً بتطوير مهارات القراءة لدى التلاميذ.'
  },
  { 
    id: 'T102', 
    name: 'أستاذة ليلى', 
    subject: 'الرياضيات', 
    email: 'leila@school.dz', 
    phone: '0544556677', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leila', 
    registrationDate: '2023-01-15',
    rating: 4.5,
    performance: [
      { label: 'التمكن العلمي', score: 98 },
      { label: 'إدارة القسم', score: 82 },
      { label: 'التواصل مع الأولياء', score: 85 }
    ],
    notes: 'تستخدم طرقاً مبتكرة في تبسيط المفاهيم الحسابية.'
  },
  { 
    id: 'T103', 
    name: 'أستاذ سمير', 
    subject: 'التربية العلمية', 
    email: 'samir@school.dz', 
    phone: '0566778899', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samir', 
    registrationDate: '2021-11-20',
    rating: 4.2,
    performance: [
      { label: 'التمكن العلمي', score: 85 },
      { label: 'إدارة القسم', score: 90 },
      { label: 'التواصل مع الأولياء', score: 80 }
    ]
  },
  { 
    id: 'T104', 
    name: 'أستاذة نورة', 
    subject: 'التربية الفنية', 
    email: 'noura@school.dz', 
    phone: '0577112244', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noura', 
    registrationDate: '2024-02-10',
    rating: 4.9,
    performance: [
      { label: 'التمكن العلمي', score: 92 },
      { label: 'إدارة القسم', score: 95 },
      { label: 'التواصل مع الأولياء', score: 98 }
    ]
  },
  { 
    id: 'T105', 
    name: 'أستاذ كمال', 
    subject: 'التربية البدنية', 
    email: 'kamal@school.dz', 
    phone: '0588334455', 
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamal', 
    registrationDate: '2022-10-05',
    rating: 4.0,
    performance: [
      { label: 'التمكن العلمي', score: 80 },
      { label: 'إدارة القسم', score: 85 },
      { label: 'التواصل مع الأولياء', score: 75 }
    ]
  },
];

export const MOCK_CLASSES: ClassRoom[] = [
  { id: 'c1', name: 'القسم 1أ', level: StudentLevel.LEVEL_1, teacherId: 't1', capacity: 30 },
  { id: 'c2', name: 'القسم 3ب', level: StudentLevel.LEVEL_3, teacherId: 't2', capacity: 25 },
];

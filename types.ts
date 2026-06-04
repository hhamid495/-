
export enum StudentLevel {
  LEVEL_1 = 'السنة الأولى',
  LEVEL_2 = 'السنة الثانية',
  LEVEL_3 = 'السنة الثالثة',
  LEVEL_4 = 'السنة الرابعة',
  LEVEL_5 = 'السنة الخامسة',
}

export interface Student {
  id: string;
  name: string;
  level: StudentLevel;
  parentName: string;
  phone: string;
  birthDate: string;
  photo: string;
  performance?: PerformanceMetric[];
}

export interface ArchivedStudent extends Student {
  archiveStatus: 'graduated' | 'transferred' | 'other';
  archiveDate: string;
  archiveReason: string;
  archiveNotes?: string;
  previousClass?: string;
}

export interface PerformanceMetric {
  label: string;
  score: number; // 0 to 100
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  photo: string;
  registrationDate: string;
  apiKey?: string;
  rating?: number; // 0 to 5
  performance?: PerformanceMetric[];
  notes?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  level: StudentLevel;
  teacherId: string;
  capacity: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  attendanceRate: number;
}

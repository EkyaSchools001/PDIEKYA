export interface PDHoursRecord {
  id: string;
  teacherId: string;
  activityType: 'Course' | 'Training' | 'Workshop' | 'Observation';
  activityId: string;
  activityName: string;
  hours: number;
  date: string;
  status: 'Completed' | 'In Progress' | 'Pending Approval';
}

export const pdHoursRecords: PDHoursRecord[] = [
  {
    id: 'PDH001',
    teacherId: 'Ekya001',
    activityType: 'Course',
    activityId: 'CRS002',
    activityName: 'Data-Driven Instruction',
    hours: 6,
    date: '2026-01-10',
    status: 'Completed',
  },
  {
    id: 'PDH002',
    teacherId: 'Ekya001',
    activityType: 'Training',
    activityId: 'TRN003',
    activityName: 'Assessment Strategies Training',
    hours: 2,
    date: '2026-01-22',
    status: 'Completed',
  },
  {
    id: 'PDH003',
    teacherId: 'Ekya001',
    activityType: 'Course',
    activityId: 'CRS001',
    activityName: 'Advanced Classroom Management',
    hours: 6,
    date: '2026-01-25',
    status: 'In Progress',
  },
  {
    id: 'PDH004',
    teacherId: 'Ekya002',
    activityType: 'Course',
    activityId: 'CRS004',
    activityName: 'Digital Teaching Tools Workshop',
    hours: 3,
    date: '2026-01-20',
    status: 'In Progress',
  },
  {
    id: 'PDH005',
    teacherId: 'Ekya003',
    activityType: 'Course',
    activityId: 'CRS005',
    activityName: 'Differentiated Instruction',
    hours: 7,
    date: '2026-01-15',
    status: 'Completed',
  },
  {
    id: 'PDH006',
    teacherId: 'Ekya004',
    activityType: 'Training',
    activityId: 'TRN005',
    activityName: 'STEM Integration Workshop',
    hours: 3,
    date: '2026-02-15',
    status: 'Pending Approval',
  },
];

export const getPDHoursByTeacher = (teacherId: string): PDHoursRecord[] => {
  return pdHoursRecords.filter((record) => record.teacherId === teacherId);
};

export const calculateTotalPDHours = (teacherId: string): number => {
  const records = getPDHoursByTeacher(teacherId);
  return records
    .filter((record) => record.status === 'Completed')
    .reduce((total, record) => total + record.hours, 0);
};

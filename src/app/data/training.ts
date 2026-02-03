export interface TrainingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  campus: string;
  topic: string;
  status: 'Upcoming' | 'Open' | 'Attended' | 'Completed';
  capacity: number;
  enrolled: number;
  registrationDeadline: string;
  color: string;
}

export interface TrainingAttendance {
  id: string;
  eventId: string;
  teacherId: string;
  registrationDate: string;
  attended: boolean;
}

export const trainingEvents: TrainingEvent[] = [
  {
    id: 'TRN001',
    title: 'Digital Teaching Tools Workshop',
    date: '2026-02-05',
    time: '10:00 AM - 12:00 PM',
    campus: 'City Campus',
    topic: 'Technology Integration',
    status: 'Upcoming',
    capacity: 30,
    enrolled: 15,
    registrationDeadline: '2026-02-03',
    color: '#A37FBC',
  },
  {
    id: 'TRN002',
    title: 'Differentiated Instruction Seminar',
    date: '2026-02-12',
    time: '2:00 PM - 4:00 PM',
    campus: 'All Campuses',
    topic: 'Pedagogy',
    status: 'Open',
    capacity: 50,
    enrolled: 22,
    registrationDeadline: '2026-02-10',
    color: '#3B82F6',
  },
  {
    id: 'TRN003',
    title: 'Assessment Strategies Training',
    date: '2026-01-22',
    time: '9:00 AM - 11:00 AM',
    campus: 'BTM Campus',
    topic: 'Assessment',
    status: 'Completed',
    capacity: 25,
    enrolled: 25,
    registrationDeadline: '2026-01-20',
    color: '#10B981',
  },
  {
    id: 'TRN004',
    title: 'Classroom Management Techniques',
    date: '2026-02-08',
    time: '3:00 PM - 5:00 PM',
    campus: 'JPN Campus',
    topic: 'Professional Development',
    status: 'Open',
    capacity: 20,
    enrolled: 12,
    registrationDeadline: '2026-02-06',
    color: '#F59E0B',
  },
  {
    id: 'TRN005',
    title: 'STEM Integration Workshop',
    date: '2026-02-15',
    time: '10:00 AM - 1:00 PM',
    campus: 'Nice Road Campus',
    topic: 'Subject Specific',
    status: 'Upcoming',
    capacity: 35,
    enrolled: 18,
    registrationDeadline: '2026-02-13',
    color: '#F43F5E',
  },
];

export const trainingAttendances: TrainingAttendance[] = [
  {
    id: 'ATD001',
    eventId: 'TRN003',
    teacherId: 'Ekya001',
    registrationDate: '2026-01-15',
    attended: true,
  },
  {
    id: 'ATD002',
    eventId: 'TRN001',
    teacherId: 'Ekya001',
    registrationDate: '2026-01-25',
    attended: false,
  },
];

export const getTrainingEventsByCampus = (campus: string): TrainingEvent[] => {
  if (campus === 'All Campuses') return trainingEvents;
  return trainingEvents.filter((event) => event.campus === campus || event.campus === 'All Campuses');
};

export const getTrainingAttendanceByTeacher = (teacherId: string): TrainingAttendance[] => {
  return trainingAttendances.filter((attendance) => attendance.teacherId === teacherId);
};

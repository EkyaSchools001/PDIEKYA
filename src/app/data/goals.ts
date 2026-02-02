export interface Goal {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  target: string;
  progress: number;
  setBy: string;
  setById: string;
  createdDate: string;
  status: 'Active' | 'Completed' | 'Cancelled';
}

export const goals: Goal[] = [
  {
    id: 'GOAL001',
    teacherId: 'Ekya001',
    title: 'Improve Student Engagement',
    description: 'Increase average student participation by 20% through interactive teaching methods',
    target: '2026-06-30',
    progress: 60,
    setBy: 'Self',
    setById: 'Ekya001',
    createdDate: '2026-01-05',
    status: 'Active',
  },
  {
    id: 'GOAL002',
    teacherId: 'Ekya001',
    title: 'Complete Technology Certification',
    description: 'Obtain Google Certified Educator Level 1',
    target: '2026-03-31',
    progress: 80,
    setBy: 'Kai',
    setById: 'EkyaH001',
    createdDate: '2025-12-15',
    status: 'Active',
  },
  {
    id: 'GOAL003',
    teacherId: 'Ekya002',
    title: 'Develop Assessment Skills',
    description: 'Create a comprehensive assessment bank for Math curriculum',
    target: '2026-05-31',
    progress: 45,
    setBy: 'Alaric',
    setById: 'EkyaH002',
    createdDate: '2026-01-10',
    status: 'Active',
  },
  {
    id: 'GOAL004',
    teacherId: 'Ekya003',
    title: 'Enhance Differentiation Strategies',
    description: 'Implement differentiated instruction in all lessons',
    target: '2026-04-30',
    progress: 70,
    setBy: 'Self',
    setById: 'Ekya003',
    createdDate: '2025-12-01',
    status: 'Active',
  },
  {
    id: 'GOAL005',
    teacherId: 'Ekya004',
    title: 'Integrate STEM Activities',
    description: 'Design and implement 5 cross-curricular STEM projects',
    target: '2026-06-15',
    progress: 40,
    setBy: 'Tyler',
    setById: 'EkyaH004',
    createdDate: '2026-01-08',
    status: 'Active',
  },
];

export const getGoalsByTeacher = (teacherId: string): Goal[] => {
  return goals.filter((goal) => goal.teacherId === teacherId);
};

export const getGoalById = (id: string): Goal | undefined => {
  return goals.find((goal) => goal.id === id);
};

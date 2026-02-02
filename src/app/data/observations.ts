export interface Observation {
  id: string;
  teacherId: string;
  teacherName: string;
  observerId: string;
  observerName: string;
  date: string;
  domain: string;
  score: number;
  feedback: string;
  tags: string[];
  status: 'Pending' | 'Acknowledged' | 'Reflected';
  reflection?: string;
}

export const observations: Observation[] = [
  {
    id: 'OBS001',
    teacherId: 'Ekya001',
    teacherName: 'Elena',
    observerId: 'EkyaH001',
    observerName: 'Kai',
    date: '2026-01-20',
    domain: 'Classroom Management',
    score: 4.5,
    feedback: 'Excellent engagement strategies. Students were actively participating throughout the lesson. The use of group activities was particularly effective.',
    tags: ['P1', 'Completed'],
    status: 'Reflected',
  },
  {
    id: 'OBS002',
    teacherId: 'Ekya002',
    teacherName: 'Stefen',
    observerId: 'EkyaH002',
    observerName: 'Alaric',
    date: '2026-01-22',
    domain: 'Content Delivery',
    score: 4.2,
    feedback: 'Clear explanations and good use of visual aids. Consider incorporating more real-world examples to enhance student understanding.',
    tags: ['P1', 'Pending'],
    status: 'Pending',
  },
  {
    id: 'OBS003',
    teacherId: 'Ekya003',
    teacherName: 'Damon',
    observerId: 'EkyaH003',
    observerName: 'Liz',
    date: '2026-01-18',
    domain: 'Student Assessment',
    score: 4.0,
    feedback: 'Good variety of assessment methods. Formative assessments were well-integrated into the lesson flow.',
    tags: ['P1', 'Acknowledged'],
    status: 'Acknowledged',
  },
  {
    id: 'OBS004',
    teacherId: 'Ekya001',
    teacherName: 'Elena',
    observerId: 'EkyaH001',
    observerName: 'Kai',
    date: '2026-01-15',
    domain: 'Student Engagement',
    score: 4.7,
    feedback: 'Outstanding ability to maintain student interest. Excellent questioning techniques that promoted critical thinking.',
    tags: ['P1', 'Reflected'],
    status: 'Reflected',
  },
  {
    id: 'OBS005',
    teacherId: 'Ekya004',
    teacherName: 'Matt',
    observerId: 'EkyaH004',
    observerName: 'Tyler',
    date: '2026-01-25',
    domain: 'Technology Integration',
    score: 4.3,
    feedback: 'Effective use of digital tools to enhance learning. Students were engaged with the interactive presentations.',
    tags: ['P1', 'Pending'],
    status: 'Pending',
  },
  {
    id: 'OBS006',
    teacherId: 'Ekya005',
    teacherName: 'Caroline',
    observerId: 'EkyaH002',
    observerName: 'Alaric',
    date: '2026-01-23',
    domain: 'Classroom Management',
    score: 4.1,
    feedback: 'Good control of classroom dynamics. Transition between activities could be smoother.',
    tags: ['P1', 'Acknowledged'],
    status: 'Acknowledged',
  },
];

export const getObservationsByTeacher = (teacherId: string): Observation[] => {
  return observations.filter((obs) => obs.teacherId === teacherId);
};

export const getObservationsByObserver = (observerId: string): Observation[] => {
  return observations.filter((obs) => obs.observerId === observerId);
};

export const getObservationById = (id: string): Observation | undefined => {
  return observations.find((obs) => obs.id === id);
};

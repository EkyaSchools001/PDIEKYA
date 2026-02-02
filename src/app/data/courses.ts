export interface Course {
  id: string;
  title: string;
  category: string;
  hours: number;
  prerequisites: string;
  status: 'Published' | 'Draft' | 'Pending Approval';
  description: string;
}

export interface CourseEnrollment {
  id: string;
  teacherId: string;
  courseId: string;
  enrollmentDate: string;
  progress: number;
  status: 'Not Started' | 'In Progress' | 'Completed';
  completionDate?: string;
}

export const courses: Course[] = [
  {
    id: 'CRS001',
    title: 'Advanced Classroom Management',
    category: 'Professional Development',
    hours: 8,
    prerequisites: 'None',
    status: 'Published',
    description: 'Learn advanced techniques for managing diverse classroom environments.',
  },
  {
    id: 'CRS002',
    title: 'Data-Driven Instruction',
    category: 'Assessment',
    hours: 6,
    prerequisites: 'Basic Assessment',
    status: 'Published',
    description: 'Use student data to inform and improve instructional practices.',
  },
  {
    id: 'CRS003',
    title: 'STEM Integration Techniques',
    category: 'Subject Specific',
    hours: 10,
    prerequisites: 'None',
    status: 'Published',
    description: 'Integrate Science, Technology, Engineering, and Mathematics across curriculum.',
  },
  {
    id: 'CRS004',
    title: 'Digital Teaching Tools Workshop',
    category: 'Technology Integration',
    hours: 5,
    prerequisites: 'None',
    status: 'Published',
    description: 'Master the use of digital tools and platforms for effective teaching.',
  },
  {
    id: 'CRS005',
    title: 'Differentiated Instruction',
    category: 'Pedagogy',
    hours: 7,
    prerequisites: 'None',
    status: 'Published',
    description: 'Strategies for meeting diverse learning needs in the classroom.',
  },
];

export const courseEnrollments: CourseEnrollment[] = [
  {
    id: 'ENR001',
    teacherId: 'Ekya001',
    courseId: 'CRS001',
    enrollmentDate: '2025-12-01',
    progress: 75,
    status: 'In Progress',
  },
  {
    id: 'ENR002',
    teacherId: 'Ekya001',
    courseId: 'CRS002',
    enrollmentDate: '2025-11-15',
    progress: 100,
    status: 'Completed',
    completionDate: '2026-01-10',
  },
  {
    id: 'ENR003',
    teacherId: 'Ekya001',
    courseId: 'CRS003',
    enrollmentDate: '2026-01-20',
    progress: 0,
    status: 'Not Started',
  },
  {
    id: 'ENR004',
    teacherId: 'Ekya002',
    courseId: 'CRS004',
    enrollmentDate: '2026-01-05',
    progress: 60,
    status: 'In Progress',
  },
  {
    id: 'ENR005',
    teacherId: 'Ekya003',
    courseId: 'CRS005',
    enrollmentDate: '2025-12-20',
    progress: 100,
    status: 'Completed',
    completionDate: '2026-01-15',
  },
];

export const getCourseEnrollmentsByTeacher = (teacherId: string): CourseEnrollment[] => {
  return courseEnrollments.filter((enrollment) => enrollment.teacherId === teacherId);
};

export const getCourseById = (courseId: string): Course | undefined => {
  return courses.find((course) => course.id === courseId);
};

import { createContext, useContext, useState, ReactNode } from 'react';
import { User, getUserByEmail, getUserRole, teachers, headOfSchools, admins, allUsers } from '@/app/data/users';
import { Observation, observations } from '@/app/data/observations';
import { Course, CourseEnrollment, courses, courseEnrollments } from '@/app/data/courses';
import { TrainingEvent, TrainingAttendance, trainingEvents, trainingAttendances } from '@/app/data/training';
import { Goal, goals } from '@/app/data/goals';
import { PDHoursRecord, pdHoursRecords } from '@/app/data/pdHours';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  expiryDate?: string;
  duration?: number;
  type: 'General' | 'Urgent' | 'Academic' | 'Holiday' | 'Register';
}

export interface GalleryImage {
  id: string;
  url: string;
  cap?: string;
  duration?: number;
  expiryDate?: string;
}

interface AppContextType {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Users
  getUsers: () => User[];
  addUser: (user: User) => void;
  updateUser: (empId: string, updates: Partial<User>) => void;
  deleteUser: (empId: string) => void;
  getAllTeachers: () => User[];
  getAllHeadOfSchools: () => User[];
  getAllAdmins: () => User[];
  getTeachersByCampus: (campus: string) => User[];

  // Observations
  getObservations: () => Observation[];
  getObservationsByTeacher: (teacherId: string) => Observation[];
  getObservationsByObserver: (observerId: string) => Observation[];
  addObservation: (observation: Omit<Observation, 'id'>) => void;
  updateObservation: (id: string, updates: Partial<Observation>) => void;

  // Courses
  getCourses: () => Course[];
  addCourse: (course: Omit<Course, 'id'> & { id?: string }) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getEnrollmentsByTeacher: (teacherId: string) => CourseEnrollment[];
  getEnrollments: () => CourseEnrollment[];
  addCourseEnrollment: (enrollment: Omit<CourseEnrollment, 'id'>) => void;

  // Training
  getTrainingEvents: () => TrainingEvent[];
  getTrainingEventsByCampus: (campus: string) => TrainingEvent[];
  getTrainingAttendanceByTeacher: (teacherId: string) => TrainingAttendance[];
  addTrainingAttendance: (attendance: Omit<TrainingAttendance, 'id'>) => void;
  addTrainingEvent: (event: Omit<TrainingEvent, 'id'>) => void;
  updateTrainingEvent: (id: string, updates: Partial<TrainingEvent>) => void;
  deleteTrainingEvent: (id: string) => void;
  markAttendance: (attendanceId: string, attended: boolean) => void;

  // Goals
  getGoals: () => Goal[];
  getGoalsByTeacher: (teacherId: string) => Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;

  // PD Hours
  getPDHoursByTeacher: (teacherId: string) => PDHoursRecord[];
  getTotalPDHours: (teacherId: string) => number;

  // Announcements
  getAnnouncements: () => Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Gallery
  getGalleryImages: () => GalleryImage[];
  updateGalleryImage: (id: string, updates: Partial<GalleryImage>) => void;
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => void;
  deleteGalleryImage: (id: string) => void;

  // Audit Logs
  getAuditLogs: () => any[];
  addAuditLog: (log: Omit<any, 'id' | 'timestamp'>) => void;

  // Settings
  getSettings: () => { maintenanceMode: boolean; allowRegistration: boolean };
  updateSettings: (updates: Partial<{ maintenanceMode: boolean; allowRegistration: boolean }>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Local state for dynamic data
  const [usersData, setUsersData] = useState<User[]>(allUsers);
  const [observationsData, setObservationsData] = useState<Observation[]>(observations);
  const [coursesData, setCoursesData] = useState<Course[]>(courses);
  const [enrollmentsData, setEnrollmentsData] = useState<CourseEnrollment[]>(courseEnrollments);
  const [trainingEventsData, setTrainingEventsData] = useState<TrainingEvent[]>(trainingEvents);
  const [attendanceData, setAttendanceData] = useState<TrainingAttendance[]>(trainingAttendances);
  const [goalsData, setGoalsData] = useState<Goal[]>(goals);
  const [pdHoursData] = useState<PDHoursRecord[]>(pdHoursRecords);
  const [announcementsData, setAnnouncementsData] = useState<Announcement[]>([
    {
      id: 'ANN001',
      title: 'Welcome to EKYA PDI',
      content: 'We are excited to launch our new Professional Development & Improvement platform.',
      date: new Date().toISOString(),
      type: 'General',
    },
    {
      id: 'ANN002',
      title: 'Term 2 Observations',
      content: 'Classroom observations for Term 2 will begin from next week. Please check your schedule.',
      date: new Date().toISOString(),
      type: 'Academic',
    },
  ]);
  const [galleryData, setGalleryData] = useState<GalleryImage[]>([
    { id: 'IMG001', url: 'https://images.unsplash.com/photo-1602016752172-29a1b51d3599?auto=format&fit=crop&q=80&w=800', cap: 'Collaborative Learning' },
    { id: 'IMG002', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800', cap: 'Creative Expression' },
    { id: 'IMG003', url: 'https://images.unsplash.com/photo-1545624447-5821b77a66f7?auto=format&fit=crop&q=80&w=800', cap: 'Outdoor Play' },
    { id: 'IMG004', url: 'https://images.unsplash.com/photo-1587654062363-34ce7ad4577b?auto=format&fit=crop&q=80&w=800', cap: 'Scientific Inquiry' },
    { id: 'IMG005', url: 'https://images.unsplash.com/photo-1588075592405-d3d0f2754470?auto=format&fit=crop&q=80&w=800', cap: 'Joyful Moments' }
  ]);
  const [auditLogsData, setAuditLogsData] = useState<any[]>([
    {
      id: 'LOG001',
      action: 'System Initialized',
      user: 'System',
      target: 'Platform',
      timestamp: new Date().toLocaleString(),
      type: 'System',
    }
  ]);
  const [settingsData, setSettingsData] = useState({
    maintenanceMode: false,
    allowRegistration: true,
  });

  const login = (email: string, password: string): boolean => {
    const user = getUserByEmail(email);
    if (user && user.password === password) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // User methods
  const getUsers = () => usersData;
  const addUser = (user: User) => {
    setUsersData([...usersData, user]);
    addAuditLog({ action: 'User Created', user: currentUser?.name || 'System', target: user.name, type: 'Management' });
  };
  const updateUser = (empId: string, updates: Partial<User>) => {
    setUsersData(usersData.map(u => u.empId === empId ? { ...u, ...updates } : u));
    addAuditLog({ action: 'User Updated', user: currentUser?.name || 'System', target: empId, type: 'Management' });
  };
  const deleteUser = (empId: string) => {
    const userToDelete = usersData.find(u => u.empId === empId);
    setUsersData(usersData.filter(u => u.empId !== empId));
    addAuditLog({ action: 'User Deleted', user: currentUser?.name || 'System', target: userToDelete?.name || empId, type: 'Management' });
  };
  const getAllTeachers = () => usersData.filter(u => u.designation === 'Teacher');
  const getAllHeadOfSchools = () => usersData.filter(u => u.designation === 'HOS');
  const getAllAdmins = () => usersData.filter(u => u.designation === 'Admin');
  const getTeachersByCampus = (campus: string) => {
    return getAllTeachers().filter((teacher) => teacher.campus === campus);
  };

  // Observation methods
  const getObservations = () => observationsData;
  const getObservationsByTeacher = (teacherId: string) => {
    return observationsData.filter((obs) => obs.teacherId === teacherId);
  };
  const getObservationsByObserver = (observerId: string) => {
    return observationsData.filter((obs) => obs.observerId === observerId);
  };
  const addObservation = (observation: Omit<Observation, 'id'>) => {
    const newObs = {
      ...observation,
      id: `OBS${String(observationsData.length + 1).padStart(3, '0')}`,
    };
    setObservationsData([...observationsData, newObs]);
  };
  const updateObservation = (id: string, updates: Partial<Observation>) => {
    setObservationsData(
      observationsData.map((obs) => (obs.id === id ? { ...obs, ...updates } : obs))
    );
  };

  // Course methods
  const getCourses = () => coursesData;
  const addCourse = (course: Omit<Course, 'id'> & { id?: string }) => {
    const newCourse = {
      ...course,
      id: course.id || `CRS${String(coursesData.length + 1).padStart(3, '0')}`,
    } as Course;
    setCoursesData([...coursesData, newCourse]);
    addAuditLog({ action: 'Course Added', user: currentUser?.name || 'System', target: newCourse.title, type: 'Academic' });
  };
  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCoursesData(coursesData.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  const deleteCourse = (id: string) => {
    setCoursesData(coursesData.filter(c => c.id !== id));
  };
  const getEnrollmentsByTeacher = (teacherId: string) => {
    return enrollmentsData.filter((enrollment) => enrollment.teacherId === teacherId);
  };
  const getEnrollments = () => enrollmentsData;
  const addCourseEnrollment = (enrollment: Omit<CourseEnrollment, 'id'>) => {
    const newEnrollment = {
      ...enrollment,
      id: `ENR${String(enrollmentsData.length + 1).padStart(3, '0')}`,
    };
    setEnrollmentsData([...enrollmentsData, newEnrollment]);
  };

  // Training methods
  // Training methods
  const getTrainingEvents = () => trainingEventsData;

  const getTrainingEventsByCampus = (campus: string) => {
    if (campus === 'All Campuses') return trainingEventsData;
    return trainingEventsData.filter(
      (event) => event.campus === campus || event.campus === 'All Campuses'
    );
  };

  const getTrainingAttendanceByTeacher = (teacherId: string) => {
    return attendanceData.filter((atd) => atd.teacherId === teacherId);
  };

  const addTrainingAttendance = (attendance: Omit<TrainingAttendance, 'id'>) => {
    const newAtd = {
      ...attendance,
      id: `ATD${String(attendanceData.length + 1).padStart(3, '0')}`,
    };
    setAttendanceData([...attendanceData, newAtd]);

    // Update enrolled count
    const eventIndex = trainingEventsData.findIndex(e => e.id === attendance.eventId);
    if (eventIndex !== -1) {
      const updatedEvents = [...trainingEventsData];
      updatedEvents[eventIndex] = {
        ...updatedEvents[eventIndex],
        enrolled: updatedEvents[eventIndex].enrolled + 1
      };
      setTrainingEventsData(updatedEvents);
    }

    addAuditLog({ action: 'Training Registered', user: currentUser?.name || 'System', target: attendance.eventId, type: 'Professional' });
  };

  const addTrainingEvent = (event: Omit<TrainingEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: `TRN${String(trainingEventsData.length + 1).padStart(3, '0')}`,
    };
    setTrainingEventsData([...trainingEventsData, newEvent]);
    addAuditLog({ action: 'Training Created', user: currentUser?.name || 'System', target: event.title, type: 'Management' });
  };

  const updateTrainingEvent = (id: string, updates: Partial<TrainingEvent>) => {
    setTrainingEventsData(trainingEventsData.map(event => event.id === id ? { ...event, ...updates } : event));
    addAuditLog({ action: 'Training Updated', user: currentUser?.name || 'System', target: id, type: 'Management' });
  };

  const deleteTrainingEvent = (id: string) => {
    setTrainingEventsData(trainingEventsData.filter(event => event.id !== id));
    addAuditLog({ action: 'Training Deleted', user: currentUser?.name || 'System', target: id, type: 'Management' });
  };

  const markAttendance = (attendanceId: string, attended: boolean) => {
    setAttendanceData(attendanceData.map(record =>
      record.id === attendanceId ? { ...record, attended } : record
    ));
    // Optionally log this or update PD hours if attended is true
  };

  // Goal methods
  const getGoals = () => goalsData;
  const getGoalsByTeacher = (teacherId: string) => {
    return goalsData.filter((goal) => goal.teacherId === teacherId);
  };
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: `GOAL${String(goalsData.length + 1).padStart(3, '0')}`,
    };
    setGoalsData([...goalsData, newGoal]);
  };
  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoalsData(goalsData.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)));
  };

  // PD Hours methods
  const getPDHoursByTeacher = (teacherId: string) => {
    return pdHoursData.filter((record) => record.teacherId === teacherId);
  };
  const getTotalPDHours = (teacherId: string) => {
    const records = getPDHoursByTeacher(teacherId);
    return records
      .filter((record) => record.status === 'Completed')
      .reduce((total, record) => total + record.hours, 0);
  };

  // Announcement methods
  const getAnnouncements = () => announcementsData;
  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    let expiryDate = undefined;
    if (announcement.duration && announcement.duration > 0) {
      const date = new Date();
      date.setDate(date.getDate() + announcement.duration);
      expiryDate = date.toISOString();
    }

    const newAnnouncement = {
      ...announcement,
      id: `ANN${String(announcementsData.length + 1).padStart(3, '0')}`,
      expiryDate,
    };
    setAnnouncementsData([newAnnouncement, ...announcementsData]);
  };
  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncementsData(announcementsData.map(ann => ann.id === id ? { ...ann, ...updates } : ann));
  };
  const deleteAnnouncement = (id: string) => {
    setAnnouncementsData(announcementsData.filter((ann) => ann.id !== id));
  };

  // Gallery methods
  const getGalleryImages = () => galleryData;
  const updateGalleryImage = (id: string, updates: Partial<GalleryImage>) => {
    setGalleryData(galleryData.map(img => img.id === id ? { ...img, ...updates } : img));
  };
  const addGalleryImage = (image: Omit<GalleryImage, 'id'>) => {
    const newImg = {
      ...image,
      id: `IMG${String(galleryData.length + 1).padStart(3, '0')}`,
    };
    setGalleryData([...galleryData, newImg]);
  };
  const deleteGalleryImage = (id: string) => {
    setGalleryData(galleryData.filter(img => img.id !== id));
  };

  // Audit Logs
  const getAuditLogs = () => auditLogsData;
  const addAuditLog = (log: Omit<any, 'id' | 'timestamp'>) => {
    const newLog = {
      ...log,
      id: `LOG${String(auditLogsData.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toLocaleString(),
    };
    setAuditLogsData([newLog, ...auditLogsData]);
  };

  // Settings
  const getSettings = () => settingsData;
  const updateSettings = (updates: Partial<{ maintenanceMode: boolean; allowRegistration: boolean }>) => {
    setSettingsData({ ...settingsData, ...updates });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        getUsers,
        addUser,
        updateUser,
        deleteUser,
        getAllTeachers,
        getAllHeadOfSchools,
        getAllAdmins,
        getTeachersByCampus,
        getObservations,
        getObservationsByTeacher,
        getObservationsByObserver,
        addObservation,
        updateObservation,
        getCourses,
        addCourse,
        updateCourse,
        deleteCourse,
        getEnrollmentsByTeacher,
        getEnrollments,
        addCourseEnrollment,
        getTrainingEvents,
        getTrainingEventsByCampus,
        getTrainingAttendanceByTeacher,
        addTrainingAttendance,
        addTrainingEvent,
        updateTrainingEvent,
        deleteTrainingEvent,
        markAttendance,
        getGoals,
        getGoalsByTeacher,
        addGoal,
        updateGoal,
        getPDHoursByTeacher,
        getTotalPDHours,
        getAnnouncements,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        getGalleryImages,
        updateGalleryImage,
        addGalleryImage,
        deleteGalleryImage,
        getAuditLogs,
        addAuditLog,
        getSettings,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

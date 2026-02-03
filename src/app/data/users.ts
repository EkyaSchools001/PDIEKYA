export interface User {
  empId: string;
  name: string;
  email: string;
  designation: string;
  campus: string;
  password: string;
  profilePicture?: string;
  department?: string;
}

export const teachers: User[] = [
  {
    empId: 'Ekya001',
    name: 'Elena',
    email: 'elena@ekyaschool.in',
    designation: 'Teacher',
    campus: 'City Campus',
    password: 'PASSWORD',
  },
  {
    empId: 'Ekya002',
    name: 'Stefen',
    email: 'stefen@ekyaschools.in',
    designation: 'Teacher',
    campus: 'BTM Campus',
    password: 'PASSWORD',
  },
  {
    empId: 'Ekya003',
    name: 'Damon',
    email: 'damon@ekyaschool.in',
    designation: 'Teacher',
    campus: 'JPN Campus',
    password: 'PASSWORD',
  },
  {
    empId: 'Ekya004',
    name: 'Matt',
    email: 'matt@ekyaschool.in',
    designation: 'Teacher',
    campus: 'Nice Road Campus',
    password: 'PASSWORD',
  },
  {
    empId: 'Ekya005',
    name: 'Caroline',
    email: 'caroline@ekyaschool.in',
    designation: 'Teacher',
    campus: 'BTM Campus',
    password: 'PASSWORD',
  },
  {
    empId: 'Ekya006',
    name: 'Klaus',
    email: 'klaus@ekyaschool.in',
    designation: 'Teacher',
    campus: 'City Campus',
    password: 'PASSWORD',
  },
];

export const headOfSchools: User[] = [
  {
    empId: 'EkyaH001',
    name: 'Kai',
    email: 'kai@ekyaschool.in',
    designation: 'HOS',
    campus: 'City Campus',
    password: 'PASSWORD',
  },
  {
    empId: 'EkyaH002',
    name: 'Alaric',
    email: 'alaric@ekyaschools.in',
    designation: 'HOS',
    campus: 'BTM Campus',
    password: 'PASSWORD',
  },
  {
    empId: 'EkyaH003',
    name: 'Liz',
    email: 'liz@ekyaschool.in',
    designation: 'HOS',
    campus: 'JPN Campus',
    password: 'PASSWORD',
  },
  {
    empId: 'EkyaH004',
    name: 'Tyler',
    email: 'tyler@ekyaschool.in',
    designation: 'HOS',
    campus: 'Nice Road Campus',
    password: 'PASSWORD',
  },
];

export const admins: User[] = [
  {
    empId: 'Ekya01',
    name: 'Mark',
    email: 'mark@ekyaschool.in',
    designation: 'Admin',
    campus: 'Head Office',
    password: 'PASSWORD',
  },
  {
    empId: 'Ekya02',
    name: 'Rebekha',
    email: 'rebekha@ekyaschools.in',
    designation: 'Admin',
    campus: 'Head Office',
    password: 'PASSWORD',
  },
];

export const allUsers: User[] = [...teachers, ...headOfSchools, ...admins];

export const getUserByEmail = (email: string): User | undefined => {
  return allUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const getUserRole = (user: User): string => {
  if (user.designation === 'Teacher') return 'teacher';
  if (user.designation === 'HOS') return 'school-leader';
  if (user.designation === 'Admin') return 'admin';
  return '';
};

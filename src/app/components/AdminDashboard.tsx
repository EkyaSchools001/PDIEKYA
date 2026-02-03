import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { User } from '@/app/data/users';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import {
  PlusCircle, Edit, Trash2, Bell, LucideIcon, LayoutDashboard, ChevronRight, Shield, Search, Terminal, CheckCircle2,
  Globe, Image, Type, ArrowLeft, Link as IconLink, LogOut, Users, FileText, BookOpen, Settings, BarChart3, Calendar, TrendingUp
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/app/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';
import ProfileDashboard from '@/app/components/ProfileDashboard';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    isAuthenticated,
    logout,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    getAllTeachers,
    getAllHeadOfSchools,
    getAllAdmins,
    getCourses,
    addCourse,
    updateCourse,
    getAnnouncements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getGalleryImages,
    updateGalleryImage,
    addGalleryImage,
    deleteGalleryImage,
    getAuditLogs,
    getSettings,
    getTrainingEvents,
    addTrainingEvent,
    updateTrainingEvent,
    deleteTrainingEvent,
  } = useApp();

  const [activeView, setActiveView] = useState('overview');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'General' as any, duration: 7 });
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUserForm, setNewUserForm] = useState({
    empId: '',
    name: '',
    email: '',
    designation: 'Teacher',
    campus: 'City Campus',
    password: 'PASSWORD'
  });
  const [activeSubView, setActiveSubView] = useState('announcements');
  const [editingAnn, setEditingAnn] = useState<any>(null);
  const [isEditAnnOpen, setIsEditAnnOpen] = useState(false);
  const [isAddAnnOpen, setIsAddAnnOpen] = useState(false);
  const [editingImg, setEditingImg] = useState<any>(null);
  const [isEditImgOpen, setIsEditImgOpen] = useState(false);
  const [isAddImgOpen, setIsAddImgOpen] = useState(false);
  const [newImgForm, setNewImgForm] = useState({ url: '', cap: '', duration: 30 });

  // Training State
  const [newTraining, setNewTraining] = useState({
    title: '',
    date: '',
    time: '',
    campus: 'City Campus',
    topic: '',
    capacity: 30,
    status: 'Upcoming' as any,
    registrationDeadline: '',
    color: '#3B82F6'
  });
  const [editingTraining, setEditingTraining] = useState<any>(null);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);
  const [isEditTrainingOpen, setIsEditTrainingOpen] = useState(false);

  const [columnFilters, setColumnFilters] = useState({
    empId: '',
    name: '',
    designation: '',
    email: '',
    campus: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/login/admin', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    const generateNextId = () => {
      const role = newUserForm.designation;
      const users = getUsers();
      let prefix = 'Ekya';
      let padding = 3;
      if (role === 'HOS') prefix = 'EkyaH';
      else if (role === 'Admin') padding = 2;
      const roleUsers = users.filter(u => u.designation === role);
      const ids = roleUsers.map(u => {
        const numPart = u.empId.replace(prefix, '');
        return parseInt(numPart) || 0;
      });
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      const nextId = (maxId + 1).toString().padStart(padding, '0');
      setNewUserForm(prev => ({ ...prev, empId: `${prefix}${nextId}` }));
    };
    if (isAddUserOpen) generateNextId();
  }, [newUserForm.designation, isAddUserOpen, getUsers]);

  if (!currentUser) return null;

  const teachers = getAllTeachers();
  const allUsers = getUsers();
  const courses = getCourses();
  const announcements = getAnnouncements();
  const auditLogs = getAuditLogs();

  const filteredUsers = allUsers.map((user, idx) => ({ ...user, sNo: idx + 1 })).filter(user => {
    return (
      user.empId.toLowerCase().includes(columnFilters.empId.toLowerCase()) &&
      user.name.toLowerCase().includes(columnFilters.name.toLowerCase()) &&
      user.designation.toLowerCase().includes(columnFilters.designation.toLowerCase()) &&
      user.email.toLowerCase().includes(columnFilters.email.toLowerCase()) &&
      user.campus.toLowerCase().includes(columnFilters.campus.toLowerCase())
    );
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(newUserForm);
    setIsAddUserOpen(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.empId, editingUser);
      setIsEditUserOpen(false);
      setEditingUser(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleDeleteUser = (empId: string) => {
    if (window.confirm('Terminate user existence?')) {
      deleteUser(empId);
    }
  };

  const handleApproveCourse = (courseId: string) => {
    updateCourse(courseId, { status: 'Published' });
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    addAnnouncement({
      ...newAnnouncement,
      date: new Date().toISOString()
    });
    setIsAddAnnOpen(false);
    setNewAnnouncement({ title: '', content: '', type: 'General', duration: 7 });
  };

  const handleUpdateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnn) {
      let updates = { ...editingAnn };
      if (updates.duration && updates.duration > 0) {
        const date = new Date();
        date.setDate(date.getDate() + updates.duration);
        updates.expiryDate = date.toISOString();
      }
      updateAnnouncement(editingAnn.id, updates);
      setIsEditAnnOpen(false);
      setEditingAnn(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImgForm(prev => ({ ...prev, url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingImg) {
      let updates = { ...editingImg };
      if (updates.duration && updates.duration > 0) {
        const date = new Date();
        date.setDate(date.getDate() + updates.duration);
        updates.expiryDate = date.toISOString();
      }
      updateGalleryImage(editingImg.id, updates);
      setIsEditImgOpen(false);
      setEditingImg(null);
    }
  };

  const handleAddGalleryImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImgForm.url) {
      alert('Please provide an image URL or upload a file.');
      return;
    }

    let expiryDate = undefined;
    if (newImgForm.duration && newImgForm.duration > 0) {
      const date = new Date();
      date.setDate(date.getDate() + newImgForm.duration);
      expiryDate = date.toISOString();
    }

    addGalleryImage({
      ...newImgForm,
      expiryDate
    });
    setIsAddImgOpen(false);
    setNewImgForm({ url: '', cap: '', duration: 30 });
  };

  const handleAddTraining = (e: React.FormEvent) => {
    e.preventDefault();
    addTrainingEvent({
      ...newTraining,
      registrationDeadline: newTraining.registrationDeadline || newTraining.date,
      color: newTraining.color || '#3B82F6',
      enrolled: 0,
      status: 'Open'
    });
    setIsAddTrainingOpen(false);
    setNewTraining({
      title: '',
      date: '',
      time: '',
      campus: 'City Campus',
      topic: '',
      capacity: 30,
      status: 'Upcoming',
      registrationDeadline: '',
      color: '#3B82F6'
    });
  };

  const handleUpdateTraining = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTraining) {
      updateTrainingEvent(editingTraining.id, editingTraining);
      setIsEditTrainingOpen(false);
      setEditingTraining(null);
    }
  };

  const handleDeleteTraining = (id: string) => {
    if (window.confirm('Delete training event?')) {
      deleteTrainingEvent(id);
    }
  };

  const SidebarItem = ({ id, label, icon: Icon }: { id: string; label: string; icon: LucideIcon }) => (
    <button
      onClick={() => setActiveView(id)}
      className={`w-full flex items-center px-6 py-4 text-sm font-bold transition-all relative ${activeView === id
        ? 'text-[#A37FBC]'
        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
        }`}
    >
      {activeView === id && (
        <div className="absolute left-0 w-1.5 h-8 bg-[#A37FBC] rounded-r-full shadow-[0_0_15px_rgba(163,127,188,0.4)]"></div>
      )}
      <Icon className={`h-5 w-5 mr-4 transition-colors ${activeView === id ? 'text-[#A37FBC]' : 'text-slate-300'}`} />
      <span className="tracking-tight uppercase text-[11px] font-black">{label}</span>
      {activeView === id && <ChevronRight className="ml-auto h-4 w-4 opacity-40" />}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-[#fafafa] font-['Geist',sans-serif]">
      {/* Dynamic Mesh Background Attachment */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `var(--mesh-gradient)`,
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Sidebar */}
      <aside className="w-72 bg-white/70 backdrop-blur-3xl border-r border-black/[0.03] hidden lg:flex flex-col sticky top-0 h-screen z-20">
        <div className="p-8 border-b border-black/[0.03]">
          <div className="flex flex-col items-center">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50 mb-4">
              <img
                src="/logo.png"
                alt="Ekya School PDI"
                className="h-16 w-16 object-contain brightness-110"
              />
            </div>
            <div className="text-center">
              <h2 className="text-sm font-black text-slate-900 tracking-tighter uppercase mb-0.5">Admin Central</h2>
              <p className="text-[9px] text-[#A37FBC] font-black tracking-[0.3em] uppercase opacity-70">Ekya School PDI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto">
          <SidebarItem id="overview" label="Overview" icon={LayoutDashboard} />
          <SidebarItem id="landing-page" label="Landing Page" icon={Globe} />
          <SidebarItem id="users" label="Teachers" icon={Users} />
          <SidebarItem id="courses" label="Curriculum" icon={BookOpen} />
          <SidebarItem id="training" label="Training Manager" icon={Calendar} />
          <SidebarItem id="reports" label="Analytics" icon={BarChart3} />
          <SidebarItem id="settings" label="System" icon={Settings} />
        </nav>

        <div className="p-8 border-t border-black/[0.03] bg-white/40">
          <button
            onClick={() => setActiveView('profile')}
            className="flex items-center px-2 w-full hover:bg-white/50 rounded-2xl p-3 transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#A37FBC]/10 flex items-center justify-center text-[#A37FBC] font-black mr-4 text-sm border border-[#A37FBC]/10 shadow-inner text-center group-hover:bg-[#A37FBC] group-hover:text-white transition-all">
              {currentUser.name[0]}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-black text-slate-900 truncate tracking-tight group-hover:text-[#A37FBC] transition-colors">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate uppercase font-bold tracking-widest">View Profile</p>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#A37FBC] transition-colors" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white/70 backdrop-blur-md border-b border-black/[0.03] px-6 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-50">
              <img src="/logo.png" alt="Ekya School" className="h-8 w-8 object-contain" />
            </div>
            <h2 className="text-xs font-black text-[#A37FBC] uppercase tracking-[0.3em]">Admin Central</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
            <LogOut className="h-5 w-5 text-slate-400" />
          </Button>
        </div>

        {/* Desktop Header */}
        <header className="bg-white/40 backdrop-blur-md border-b border-black/[0.03] hidden lg:block px-12 py-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="w-6 h-[1.5px] bg-[#A37FBC] rounded-full"></span>
                <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em]">System Command</p>
              </div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{activeView}</h1>
            </div>
            <div className="flex flex-col gap-10">
              <button
                onClick={logout}
                className="group flex items-center px-8 py-4 text-xs font-black text-slate-400 hover:text-rose-500 transition-all uppercase tracking-[0.3em] bg-white/50 rounded-2xl border border-black/[0.03]"
              >
                <LogOut className="h-4 w-4 mr-4 group-hover:rotate-12 transition-transform" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-12 max-w-7xl mx-auto w-full">

            {activeView === 'overview' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                    { label: 'Total faculty', val: allUsers.length, color: 'bg-[#A37FBC]', active: 'users' },
                    { label: 'Teachers', val: teachers.length, color: 'bg-indigo-500', active: 'users' },
                    { label: 'Courses', val: courses.length, color: 'bg-emerald-500', active: 'courses' },
                    { label: 'Health', val: '99.9%', color: 'bg-blue-500', active: 'reports' }
                  ].map((stat) => (
                    <Card key={stat.label}
                      className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-[#A37FBC]/10 transition-all cursor-pointer group overflow-hidden"
                      onClick={() => setActiveView(stat.active)}
                    >
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${stat.color}`}></div>
                      <CardHeader className="p-8">
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</CardTitle>
                        <div className="text-4xl font-black text-slate-900 mt-2 group-hover:text-[#A37FBC] transition-colors">{stat.val}</div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden">
                    <CardHeader className="p-10 pb-6 border-b border-black/[0.02]">
                      <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Telemetry</CardTitle>
                      <CardDescription className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Audit Log Matrix</CardDescription>
                    </CardHeader>
                    <CardContent className="p-10 pt-6">
                      <div className="space-y-6">
                        {auditLogs.slice(0, 5).map(log => (
                          <div key={log.id} className="flex items-center gap-6 p-4 hover:bg-[#A37FBC]/5 rounded-2xl transition-all border border-transparent hover:border-[#A37FBC]/10">
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                              <Shield className="h-4 w-4 text-[#A37FBC]" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-black text-slate-900 tracking-tight">{log.action}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.user} • {log.timestamp}</p>
                            </div>
                            <Badge className="bg-slate-100 text-slate-500 border-none rounded-full px-4 text-[9px] font-black uppercase tracking-widest">
                              {log.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm flex flex-col items-center justify-center p-12 text-center group">
                    <div className="p-8 bg-[#A37FBC]/10 rounded-full mb-8 group-hover:scale-110 transition-transform duration-700">
                      <Terminal className="h-16 w-16 text-[#A37FBC]" />
                    </div>
                    <CardTitle className="text-5xl font-black text-slate-900 tracking-tighter mb-2">OPERATIONAL</CardTitle>
                    <p className="text-sm font-black text-[#A37FBC] uppercase tracking-[0.4em]">System Health Index 1.0</p>
                  </Card>
                </div>
              </div>
            )}

            {activeView === 'landing-page' && (
              <div className="space-y-12">
                <div className="flex items-center gap-4 bg-white/40 p-1.5 rounded-[2rem] w-fit border border-black/[0.03] backdrop-blur-md">
                  <Button
                    variant={activeSubView === 'announcements' ? 'default' : 'ghost'}
                    onClick={() => setActiveSubView('announcements')}
                    className={`h-12 px-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSubView === 'announcements' ? 'bg-[#A37FBC] text-white shadow-lg shadow-[#A37FBC]/20' : 'text-slate-400'
                      }`}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Announcements
                  </Button>
                  <Button
                    variant={activeSubView === 'gallery' ? 'default' : 'ghost'}
                    onClick={() => setActiveSubView('gallery')}
                    className={`h-12 px-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeSubView === 'gallery' ? 'bg-[#A37FBC] text-white shadow-lg shadow-[#A37FBC]/20' : 'text-slate-400'
                      }`}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Campus Gallery
                  </Button>
                </div>

                {activeSubView === 'announcements' ? (
                  <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden">
                    <CardHeader className="p-10 border-b border-black/[0.02] flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Announcements</CardTitle>
                        <CardDescription className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">Public Board Control</CardDescription>
                      </div>
                      <Dialog open={isAddAnnOpen} onOpenChange={setIsAddAnnOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 px-8 rounded-full shadow-lg shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all">
                            <PlusCircle className="h-4 w-4 mr-3" />
                            Post New Bulletin
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] p-10 shadow-2xl">
                          <DialogHeader className="mb-8">
                            <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">New Announcement</DialogTitle>
                            <DialogDescription className="text-sm font-semibold text-slate-500 pt-2">Publish a priority update to the landing page</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleAddAnnouncement} className="space-y-6">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</Label>
                              <Input
                                placeholder="E.g., Term 2 Commencement"
                                className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                                value={newAnnouncement.title}
                                onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classification</Label>
                              <Select value={newAnnouncement.type} onValueChange={val => setNewAnnouncement({ ...newAnnouncement, type: val as any })}>
                                <SelectTrigger className="h-14 bg-white/50 border-slate-100 rounded-2xl"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-xl">
                                  <SelectItem value="General">General Notice</SelectItem>
                                  <SelectItem value="Urgent">Urgent Alert</SelectItem>
                                  <SelectItem value="Academic">Academic Update</SelectItem>
                                  <SelectItem value="Holiday">Holiday Break</SelectItem>
                                  <SelectItem value="Register">Registration Event</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration (Days)</Label>
                              <Input
                                type="number"
                                min="1"
                                className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                                value={newAnnouncement.duration}
                                onChange={e => setNewAnnouncement({ ...newAnnouncement, duration: parseInt(e.target.value) || 7 })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bulletin Content</Label>
                              <Textarea
                                placeholder="Enter detailed message..."
                                className="min-h-[120px] bg-white/50 border-slate-100 rounded-2xl font-medium p-6"
                                value={newAnnouncement.content}
                                onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#A37FBC]/20 transition-all border-none">Publish Bulletin</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <div className="min-w-[600px]">
                        <Table>
                          <TableHeader className="bg-slate-50/50">
                            <TableRow className="border-b border-black/[0.03]">
                              <TableHead className="pl-10 font-black uppercase text-[10px] text-slate-400 tracking-widest">Date</TableHead>
                              <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Classification</TableHead>
                              <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Title</TableHead>
                              <TableHead className="text-right pr-10 font-black uppercase text-[10px] text-slate-400 tracking-widest">Control</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {announcements.map((ann) => (
                              <TableRow key={ann.id} className="border-b border-black/[0.01] hover:bg-[#A37FBC]/[0.02] transition-colors group">
                                <TableCell className="pl-10 font-bold text-slate-400 text-[11px] uppercase tracking-tighter">
                                  {new Date(ann.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-[#A37FBC]/10 text-[#A37FBC] border-none rounded-full px-4 text-[9px] font-black uppercase tracking-widest">
                                    {ann.type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-black text-slate-900 tracking-tight">{ann.title}</TableCell>
                                <TableCell className="text-right pr-10">
                                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="sm" variant="ghost" className="rounded-xl hover:bg-white hover:text-[#A37FBC] shadow-sm"
                                      onClick={() => { setEditingAnn(ann); setIsEditAnnOpen(true); }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm" variant="ghost" className="rounded-xl hover:bg-rose-50 hover:text-rose-600 shadow-sm"
                                      onClick={() => deleteAnnouncement(ann.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {getGalleryImages().map((img) => (
                      <Card key={img.id} className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden group/card hover:shadow-2xl hover:shadow-[#A37FBC]/10 transition-all duration-500 flex flex-col">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <img src={img.url} alt={img.cap} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <Button
                              size="icon" className="w-12 h-12 rounded-2xl bg-white text-[#A37FBC] hover:scale-110 transition-transform"
                              onClick={() => { setEditingImg(img); setIsEditImgOpen(true); }}
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <Button
                              size="icon" className="w-12 h-12 rounded-2xl bg-rose-500 text-white hover:scale-110 transition-transform"
                              onClick={() => deleteGalleryImage(img.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-8">
                          <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em] mb-2">{img.id}</p>
                          <h4 className="text-lg font-black text-slate-900 leading-tight">{img.cap}</h4>
                        </div>
                      </Card>
                    ))}
                    <button
                      onClick={() => setIsAddImgOpen(true)}
                      className="border-4 border-dashed border-slate-100 rounded-[3rem] aspect-[4/3] flex flex-col items-center justify-center text-slate-300 hover:text-[#A37FBC] hover:border-[#A37FBC]/20 hover:bg-[#A37FBC]/5 transition-all group"
                    >
                      <PlusCircle className="h-16 w-16 mb-4 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-black uppercase tracking-widest">Add Image Asset</span>
                    </button>
                  </div>
                )}

                {/* Editing Dialogs */}
                <Dialog open={isEditAnnOpen} onOpenChange={setIsEditAnnOpen}>
                  <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] p-10 shadow-2xl">
                    <DialogHeader className="mb-8">
                      <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Edit Bulletin</DialogTitle>
                    </DialogHeader>
                    {editingAnn && (
                      <form onSubmit={handleUpdateAnnouncement} className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Title</Label>
                          <Input
                            className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                            value={editingAnn.title}
                            onChange={e => setEditingAnn({ ...editingAnn, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Classification</Label>
                          <Select value={editingAnn.type} onValueChange={val => setEditingAnn({ ...editingAnn, type: val as any })}>
                            <SelectTrigger className="h-14 bg-white/50 border-slate-100 rounded-2xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                              <SelectItem value="General">General Notice</SelectItem>
                              <SelectItem value="Urgent">Urgent Alert</SelectItem>
                              <SelectItem value="Academic">Academic Update</SelectItem>
                              <SelectItem value="Holiday">Holiday Break</SelectItem>
                              <SelectItem value="Register">Registration Event</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Duration (Days)</Label>
                          <Input
                            type="number"
                            min="1"
                            className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                            value={editingAnn.duration || 7}
                            onChange={e => setEditingAnn({ ...editingAnn, duration: parseInt(e.target.value) || 7 })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bulletin Content</Label>
                          <Textarea
                            className="min-h-[120px] bg-white/50 border-slate-100 rounded-2xl font-medium p-6"
                            value={editingAnn.content}
                            onChange={e => setEditingAnn({ ...editingAnn, content: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#A37FBC]/20 transition-all border-none">Commit Update</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog open={isEditImgOpen} onOpenChange={setIsEditImgOpen}>
                  <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] p-10 shadow-2xl">
                    <DialogHeader className="mb-8">
                      <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Modify Asset</DialogTitle>
                    </DialogHeader>
                    {editingImg && (
                      <form onSubmit={handleUpdateGalleryImage} className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Image Endpoint (URL)</Label>
                          <div className="relative">
                            <IconLink className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <Input
                              className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl font-bold"
                              value={editingImg.url}
                              onChange={e => setEditingImg({ ...editingImg, url: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descriptive Caption</Label>
                          <div className="relative">
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <Input
                              className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl font-bold"
                              value={editingImg.cap || ''}
                              onChange={e => setEditingImg({ ...editingImg, cap: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Display Duration (Days)</Label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                            <Input
                              type="number"
                              min="1"
                              className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl font-bold"
                              value={editingImg.duration || 30}
                              onChange={e => setEditingImg({ ...editingImg, duration: parseInt(e.target.value) || 30 })}
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#A37FBC]/20 transition-all border-none">Commit Asset Sync</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddImgOpen} onOpenChange={setIsAddImgOpen}>
                  <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] p-10 shadow-2xl">
                    <DialogHeader className="mb-8">
                      <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">New Asset Registry</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddGalleryImage} className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Image Source</Label>

                        {/* File Upload Area */}
                        <div
                          className="border-2 border-dashed border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-slate-50 transition-all cursor-pointer group relative overflow-hidden"
                          onClick={() => document.getElementById('image-upload')?.click()}
                        >
                          {newImgForm.url ? (
                            <img src={newImgForm.url} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <>
                              <PlusCircle className="h-8 w-8 text-slate-300 mb-2 group-hover:text-[#A37FBC] group-hover:scale-110 transition-all" />
                              <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-[#A37FBC]">Upload Local File</span>
                            </>
                          )}
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="h-[1px] bg-slate-100 flex-1"></div>
                          <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">or use URL</span>
                          <div className="h-[1px] bg-slate-100 flex-1"></div>
                        </div>

                        <div className="relative">
                          <IconLink className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <Input
                            placeholder="https://..."
                            className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl font-bold"
                            value={newImgForm.url}
                            onChange={e => setNewImgForm({ ...newImgForm, url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descriptive Caption</Label>
                        <div className="relative">
                          <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <Input
                            placeholder="Collaborative Study (Optional)"
                            className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl font-bold"
                            value={newImgForm.cap}
                            onChange={e => setNewImgForm({ ...newImgForm, cap: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Display Duration (Days)</Label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                          <Input
                            type="number"
                            min="1"
                            placeholder="Default: 30"
                            className="h-14 pl-12 bg-white/50 border-slate-100 rounded-2xl font-bold"
                            value={newImgForm.duration}
                            onChange={e => setNewImgForm({ ...newImgForm, duration: parseInt(e.target.value) || 30 })}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#A37FBC]/20 transition-all border-none">Initialize Asset</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {activeView === 'users' && (
              <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden">
                <CardHeader className="p-10 border-b border-black/[0.02]">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Faculty Management</CardTitle>
                      <CardDescription className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">Profile Control & Verification</CardDescription>
                    </div>
                    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 px-8 rounded-full shadow-lg shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105">
                          <PlusCircle className="h-4 w-4 mr-3" />
                          Initialize User Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] shadow-2xl p-10">
                        <DialogHeader className="mb-8">
                          <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Identity Creation</DialogTitle>
                          <DialogDescription className="text-sm font-semibold text-slate-500 pt-2">Generate a new verified authentication profile</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddUser} className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity UID</Label>
                              <Input value={newUserForm.empId} className="h-14 bg-slate-100/50 border-none font-black text-[#A37FBC] text-center" disabled />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Designated Role</Label>
                              <Select value={newUserForm.designation} onValueChange={val => setNewUserForm({ ...newUserForm, designation: val })}>
                                <SelectTrigger className="h-14 bg-white/50 border-slate-100 rounded-2xl"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-xl"><SelectItem value="Teacher">Teacher Profile</SelectItem><SelectItem value="HOS">Leader Profile</SelectItem><SelectItem value="Admin">Admin Profile</SelectItem></SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Legal Designation</Label>
                            <Input placeholder="Full Name" className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold" value={newUserForm.name} onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })} required />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Telemetry Email</Label>
                            <Input type="email" placeholder="official@growthub.edu" className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold" value={newUserForm.email} onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })} required />
                          </div>
                          <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#A37FBC]/20 transition-all border-none">Commit Profile Initialization</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-black/[0.03]">
                          <TableHead className="w-20 pl-10 font-black uppercase text-[10px] text-slate-400 tracking-widest">SEQ</TableHead>
                          <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">UID</TableHead>
                          <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Entity Name</TableHead>
                          <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Role</TableHead>
                          <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Network Identity</TableHead>
                          <TableHead className="text-right pr-10 font-black uppercase text-[10px] text-slate-400 tracking-widest">Operations</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.empId} className="border-b border-black/[0.01] hover:bg-[#A37FBC]/[0.02] transition-colors group">
                            <TableCell className="pl-10 font-black text-slate-300 text-[11px]">{user.sNo}</TableCell>
                            <TableCell className="font-mono text-[11px] font-bold text-[#A37FBC] uppercase">{user.empId}</TableCell>
                            <TableCell className="font-black text-slate-900 tracking-tight">{user.name}</TableCell>
                            <TableCell>
                              <Badge className="bg-[#A37FBC]/10 text-[#A37FBC] border-none rounded-full px-4 text-[9px] font-black uppercase tracking-widest">
                                {user.designation}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-bold text-slate-500 text-xs">{user.campus}</TableCell>
                            <TableCell className="text-right pr-10">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm" variant="ghost" className="rounded-xl hover:bg-[#A37FBC]/10 hover:text-[#A37FBC] shadow-sm flex items-center gap-2 px-3"
                                  onClick={() => navigate(`/admin/vector/${user.empId}`)}
                                >
                                  <TrendingUp className="h-3.5 w-3.5" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Growth Vector</span>
                                </Button>
                                <Button size="sm" variant="ghost" className="rounded-xl hover:bg-white hover:text-[#A37FBC] shadow-sm"><Edit className="h-4 w-4" /></Button>
                                <Button size="sm" variant="ghost" className="rounded-xl hover:bg-rose-50 hover:text-rose-600 shadow-sm" onClick={() => handleDeleteUser(user.empId)}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeView === 'courses' && (
              <div className="space-y-12">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Curriculum Repository</h2>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Oversight & Deployment Protocol</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {courses.map((course) => (
                    <Card key={course.id} className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-[#A37FBC]/10 transition-all group overflow-hidden">
                      <CardHeader className="p-10 pb-6 border-b border-black/[0.02]">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xl border border-indigo-100 shadow-inner">
                              <BookOpen className="h-8 w-8" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{course.title}</CardTitle>
                              <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {course.id} <span className="text-[#A37FBC] mx-2">•</span> {course.category}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={`rounded-full px-5 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-sm ${course.status === 'Published' ? 'bg-emerald-500 text-white' :
                            course.status === 'Pending Approval' ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white'
                            }`}>
                            {course.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-10 space-y-8">
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-50">
                          <p className="text-sm font-semibold text-slate-600 italic tracking-tight">"{course.description}"</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-black/[0.02]">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Weight</div>
                            <div className="text-base font-black text-slate-900">{course.hours} HRS</div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-black/[0.02]">
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pre-Req</div>
                            <div className="text-xs font-black text-slate-900 truncate uppercase">{course.prerequisites}</div>
                          </div>
                        </div>
                        {course.status === 'Pending Approval' && (
                          <Button
                            onClick={() => handleApproveCourse(course.id)}
                            className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 rounded-2xl shadow-xl shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-3" />
                            Approve & Publish Curriculum
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'training' && (
              <div className="space-y-12">
                <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden">
                  <CardHeader className="p-10 border-b border-black/[0.02] flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Training Events</CardTitle>
                      <CardDescription className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">Professional Development Calendar</CardDescription>
                    </div>
                    <Dialog open={isAddTrainingOpen} onOpenChange={setIsAddTrainingOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 px-8 rounded-full shadow-lg shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all">
                          <PlusCircle className="h-4 w-4 mr-3" />
                          Schedule Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] p-10 shadow-2xl">
                        <DialogHeader className="mb-8">
                          <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">New Training Event</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddTraining} className="space-y-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Title</Label>
                            <Input
                              className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                              value={newTraining.title}
                              onChange={e => setNewTraining({ ...newTraining, title: e.target.value })}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</Label>
                              <Input
                                type="date"
                                className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                                value={newTraining.date}
                                onChange={e => setNewTraining({ ...newTraining, date: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Time</Label>
                              <Input
                                placeholder="e.g. 10:00 AM - 12:00 PM"
                                className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                                value={newTraining.time}
                                onChange={e => setNewTraining({ ...newTraining, time: e.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Campus</Label>
                            <Select value={newTraining.campus} onValueChange={val => setNewTraining({ ...newTraining, campus: val })}>
                              <SelectTrigger className="h-14 bg-white/50 border-slate-100 rounded-2xl"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="All Campuses">All Campuses</SelectItem>
                                <SelectItem value="City Campus">City Campus</SelectItem>
                                <SelectItem value="BTM Campus">BTM Campus</SelectItem>
                                <SelectItem value="JPN Campus">JPN Campus</SelectItem>
                                <SelectItem value="Nice Road Campus">Nice Road Campus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Topic</Label>
                            <Input
                              className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                              value={newTraining.topic}
                              onChange={e => setNewTraining({ ...newTraining, topic: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Capacity</Label>
                            <Input
                              type="number"
                              className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                              value={newTraining.capacity}
                              onChange={e => setNewTraining({ ...newTraining, capacity: parseInt(e.target.value) || 0 })}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#A37FBC]/20 transition-all border-none">Publish Event</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <div className="min-w-[800px]">
                      <Table>
                        <TableHeader className="bg-slate-50/50">
                          <TableRow className="border-b border-black/[0.03]">
                            <TableHead className="pl-10 font-black uppercase text-[10px] text-slate-400 tracking-widest">Date</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Event Details</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Campus</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Status</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Enrollment</TableHead>
                            <TableHead className="text-right pr-10 font-black uppercase text-[10px] text-slate-400 tracking-widest">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getTrainingEvents().map((event) => (
                            <TableRow key={event.id} className="border-b border-black/[0.01] hover:bg-[#A37FBC]/[0.02] transition-colors group">
                              <TableCell className="pl-10 font-bold text-slate-400 text-[11px] uppercase tracking-tighter">
                                {new Date(event.date).toLocaleDateString()}
                                <div className="text-[9px] text-[#A37FBC] mt-0.5">{event.time}</div>
                              </TableCell>
                              <TableCell>
                                <div className="font-black text-slate-900 tracking-tight">{event.title}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{event.topic}</div>
                              </TableCell>
                              <TableCell className="font-bold text-slate-500 text-xs">{event.campus}</TableCell>
                              <TableCell>
                                <Badge className={`border-none rounded-full px-4 text-[9px] font-black uppercase tracking-widest ${event.status === 'Open' ? 'bg-[#A37FBC]/10 text-[#A37FBC]' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                  {event.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-black text-slate-900 text-xs">
                                {event.enrolled} <span className="text-slate-300">/</span> {event.capacity}
                              </TableCell>
                              <TableCell className="text-right pr-10">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm" variant="ghost" className="rounded-xl hover:bg-white hover:text-[#A37FBC] shadow-sm"
                                    onClick={() => { setEditingTraining(event); setIsEditTrainingOpen(true); }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm" variant="ghost" className="rounded-xl hover:bg-rose-50 hover:text-rose-600 shadow-sm"
                                    onClick={() => handleDeleteTraining(event.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Dialog open={isEditTrainingOpen} onOpenChange={setIsEditTrainingOpen}>
                  <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] p-10 shadow-2xl">
                    <DialogHeader className="mb-8">
                      <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Edit Event</DialogTitle>
                    </DialogHeader>
                    {editingTraining && (
                      <form onSubmit={handleUpdateTraining} className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Event Title</Label>
                          <Input
                            className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                            value={editingTraining.title}
                            onChange={e => setEditingTraining({ ...editingTraining, title: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</Label>
                            <Input
                              type="date"
                              className="h-14 bg-white/50 border-slate-100 rounded-2xl font-bold"
                              value={editingTraining.date}
                              onChange={e => setEditingTraining({ ...editingTraining, date: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Status</Label>
                            <Select value={editingTraining.status} onValueChange={val => setEditingTraining({ ...editingTraining, status: val })}>
                              <SelectTrigger className="h-14 bg-white/50 border-slate-100 rounded-2xl"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="Upcoming">Upcoming</SelectItem>
                                <SelectItem value="Open">Registration Open</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Attended">Attended</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#A37FBC]/20 transition-all border-none">Save Changes</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {activeView === 'profile' && (
              <ProfileDashboard
                user={currentUser}
                onBack={() => setActiveView('overview')}
              />
            )}

            {/* Mini Footer */}
            <footer className="bg-white/40 backdrop-blur-md border-t border-black/[0.03] py-8 px-8 text-center text-slate-400 text-[10px] z-20 font-bold uppercase tracking-[0.4em]">
              <p>&copy; {new Date().getFullYear()} EKYA SCHOOL PDI <span className="text-[#A37FBC] mx-2">•</span> THE PINNACLE OF PD</p>
            </footer>
          </div>
        </ScrollArea>
      </main>
    </div >
  );
}
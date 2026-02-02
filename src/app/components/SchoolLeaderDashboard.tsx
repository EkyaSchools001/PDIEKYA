import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Textarea } from '@/app/components/ui/textarea';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { LogOut, ClipboardCheck, Users, BarChart3, PlusCircle, FileText, ChevronRight, BookOpen, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';

export default function SchoolLeaderDashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    isAuthenticated,
    logout,
    getTeachersByCampus,
    getObservationsByObserver,
    getObservationsByTeacher,
    getTotalPDHours,
    addObservation,
    getCourses,
    addCourse,
    addGoal,
    getGoalsByTeacher,
    getTrainingEvents,
    getTrainingAttendanceByTeacher,
  } = useApp();

  const [activeView, setActiveView] = useState('observe');
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [vectorDialogOpen, setVectorDialogOpen] = useState(false);
  const [dossierDialogOpen, setDossierDialogOpen] = useState(false);
  const [selectedTeacherForAction, setSelectedTeacherForAction] = useState<any>(null);
  const [selectedObservationForDossier, setSelectedObservationForDossier] = useState<any>(null);

  // Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('');
  const [goalDescription, setGoalDescription] = useState('');

  // Faculty Filter State
  const [facultySearch, setFacultySearch] = useState('');
  const [facultySort, setFacultySort] = useState('name');

  // Report Filter State
  const [reportTimeframe, setReportTimeframe] = useState('all');
  const [reportCampus, setReportCampus] = useState('all');

  // Observation form state
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [domain, setDomain] = useState('');
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  // Course form state
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCategory, setCourseCategory] = useState('Professional Development');
  const [courseHours, setCourseHours] = useState('');
  const [coursePrerequisites, setCoursePrerequisites] = useState('None');
  const [courseDescription, setCourseDescription] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/login/school-leader', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!currentUser) return null;

  const teachers = getTeachersByCampus(currentUser.campus);
  const myObservations = getObservationsByObserver(currentUser.empId);
  const allCourses = getCourses();
  // We'll show all courses for now, but focus on the ones relevant or recently added
  const myProposedCourses = allCourses.filter(c => c.status === 'Pending Approval');

  const teachersWithStats = teachers.map((teacher) => {
    const observations = getObservationsByTeacher(teacher.empId);
    const avgScore =
      observations.length > 0
        ? observations.reduce((sum, obs) => sum + obs.score, 0) / observations.length
        : 0;
    const pdHours = getTotalPDHours(teacher.empId);

    return {
      ...teacher,
      observations: observations.length,
      avgScore: avgScore.toFixed(1),
      pdHours,
      targetHours: 50,
    };
  });

  const filteredFaculty = teachersWithStats
    .filter(t => t.name.toLowerCase().includes(facultySearch.toLowerCase()) || t.empId.toLowerCase().includes(facultySearch.toLowerCase()))
    .sort((a, b) => {
      if (facultySort === 'name') return a.name.localeCompare(b.name);
      if (facultySort === 'score') return parseFloat(b.avgScore) - parseFloat(a.avgScore);
      if (facultySort === 'pd') return b.pdHours - a.pdHours;
      return 0;
    });

  const pdStats = teachers.map(t => {
    const attendance = getTrainingAttendanceByTeacher(t.empId);
    const attended = attendance.filter(a => a.attended).length;
    const allEvents = getTrainingEvents().filter(e => e.status !== 'Upcoming').length;
    const totalEvents = allEvents > 0 ? allEvents : 1;
    const rate = Math.round((attended / totalEvents) * 100);
    return { ...t, attended, rate, totalEvents };
  });

  const avgPdRate = Math.round(pdStats.reduce((acc, curr) => acc + curr.rate, 0) / (pdStats.length || 1));

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleSubmitObservation = () => {
    if (!selectedTeacher || !domain || !score || !feedback) {
      alert('Please fill all fields');
      return;
    }

    const teacher = teachers.find((t) => t.empId === selectedTeacher);
    if (!teacher) return;

    addObservation({
      teacherId: teacher.empId,
      teacherName: teacher.name,
      observerId: currentUser.empId,
      observerName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      domain,
      score: parseFloat(score),
      feedback,
      tags: ['P1', 'Pending'],
      status: 'Pending',
    });

    setObservationDialogOpen(false);
    setSelectedTeacher('');
    setDomain('');
    setScore('');
    setFeedback('');
  };

  const handleSubmitCourse = () => {
    if (!courseTitle || !courseHours || !courseDescription) {
      alert('Please fill core course details');
      return;
    }

    addCourse({
      title: courseTitle,
      category: courseCategory,
      hours: parseInt(courseHours),
      prerequisites: coursePrerequisites,
      status: 'Pending Approval',
      description: courseDescription,
    });

    setCourseDialogOpen(false);
    setCourseTitle('');
    setCourseHours('');
    setCourseDescription('');
    setCoursePrerequisites('None');
  };

  const handleSubmitGoal = () => {
    if (!selectedTeacherForAction || !goalTitle || !goalTargetDate || !goalDescription) {
      alert('Please fill all goal details');
      return;
    }

    addGoal({
      teacherId: selectedTeacherForAction.empId,
      title: goalTitle,
      description: goalDescription,
      target: goalTargetDate,
      progress: 0,
      setBy: currentUser.name,
      setById: currentUser.empId,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    });

    setGoalDialogOpen(false);
    setSelectedTeacherForAction(null);
    setGoalTitle('');
    setGoalTargetDate('');
    setGoalDescription('');
  };

  const handleSetGoal = (teacher: any) => {
    setSelectedTeacherForAction(teacher);
    setGoalDialogOpen(true);
  };

  const handleViewVector = (teacher: any) => {
    setSelectedTeacherForAction(teacher);
    setVectorDialogOpen(true);
  };

  const handleViewDossier = (obs: any) => {
    setSelectedObservationForDossier(obs);
    setDossierDialogOpen(true);
  };

  const SidebarItem = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
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
      <aside className="w-72 bg-white/70 backdrop-blur-3xl border-r border-black/[0.03] hidden md:flex flex-col sticky top-0 h-screen z-20">
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
              <h2 className="text-sm font-black text-slate-900 tracking-tighter uppercase mb-0.5">Leader Hub</h2>
              <p className="text-[9px] text-[#A37FBC] font-black tracking-[0.3em] uppercase opacity-70">Ekya School PDI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6">
          <SidebarItem id="observe" label="Observations" icon={ClipboardCheck} />
          <SidebarItem id="teachers" label="Teachers" icon={Users} />
          <SidebarItem id="pd-participation" label="PD Participation" icon={Calendar} />
          <SidebarItem id="courses" label="Courses" icon={BookOpen} />
          <SidebarItem id="reports" label="Reports" icon={BarChart3} />
        </nav>

        <div className="p-8 border-t border-black/[0.03] bg-white/40">
          <div className="flex items-center px-2">
            <div className="w-10 h-10 rounded-2xl bg-[#A37FBC]/10 flex items-center justify-center text-[#A37FBC] font-black mr-4 text-sm border border-[#A37FBC]/10 shadow-inner">
              {currentUser.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900 truncate tracking-tight">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate uppercase font-bold tracking-widest">{currentUser.campus}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden bg-white/70 backdrop-blur-md border-b border-black/[0.03] px-6 py-4 flex justify-between items-center sticky top-0 z-30">
          <h2 className="text-sm font-black text-[#A37FBC] uppercase tracking-[0.3em]">Leader Hub</h2>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
            <LogOut className="h-5 w-5 text-slate-400" />
          </Button>
        </div>

        {/* Desktop Header */}
        <header className="bg-white/40 backdrop-blur-md border-b border-black/[0.03] hidden md:block">
          <div className="px-12 py-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-6 h-[1.5px] bg-[#A37FBC] rounded-full"></span>
                  <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em]">Administrative Oversight</p>
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {activeView === 'observe' ? 'Observations' : activeView === 'courses' ? 'Course Management' : activeView}
                </h1>
              </div>

              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-12 w-12 rounded-2xl bg-white/50 border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm order-last ml-4"
                >
                  <LogOut className="h-5 w-5" />
                </Button>

                {activeView === 'observe' && (
                  <Dialog open={observationDialogOpen} onOpenChange={setObservationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-12 px-8 rounded-full shadow-lg shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border-none">
                        <PlusCircle className="h-4 w-4 mr-3" />
                        New Observation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] shadow-2xl p-10">
                      <DialogHeader className="mb-10">
                        <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Observation Summary</DialogTitle>
                        <DialogDescription className="text-sm font-semibold text-slate-500 pt-2">
                          Initialize a professional performance review for a team member
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Target Identity</Label>
                          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger className="h-14 bg-white/50 border-slate-100 rounded-2xl shadow-sm">
                              <SelectValue placeholder="Identify Teacher Profile" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                              {teachers.map((teacher) => (
                                <SelectItem key={teacher.empId} value={teacher.empId} className="font-bold py-3">
                                  {teacher.name} <span className="text-slate-400 text-[10px] font-black ml-2 opacity-50">[{teacher.empId}]</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Domain Focus</Label>
                            <Select value={domain} onValueChange={setDomain}>
                              <SelectTrigger className="h-14 bg-white/50 border-slate-100 rounded-2xl shadow-sm">
                                <SelectValue placeholder="Select Domain" />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="Classroom Management" className="font-bold py-3">Classroom Management</SelectItem>
                                <SelectItem value="Content Delivery" className="font-bold py-3">Content Delivery</SelectItem>
                                <SelectItem value="Student Assessment" className="font-bold py-3">Student Assessment</SelectItem>
                                <SelectItem value="Student Engagement" className="font-bold py-3">Student Engagement</SelectItem>
                                <SelectItem value="Technology Integration" className="font-bold py-3">Technology Integration</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Precision Score (1-5)</Label>
                            <Input
                              type="number"
                              min="1"
                              max="5"
                              step="0.1"
                              value={score}
                              onChange={(e) => setScore(e.target.value)}
                              placeholder="4.0"
                              className="h-14 bg-white/50 border-slate-100 rounded-2xl shadow-sm font-black text-center text-xl text-[#A37FBC]"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tactical Feedback</Label>
                          <Textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Detail performance observations and growth vectors..."
                            className="min-h-[160px] bg-white/50 border-slate-100 rounded-3xl p-6 text-sm font-semibold shadow-sm resize-none"
                          />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                          <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8" onClick={() => setObservationDialogOpen(false)}>
                            Abort
                          </Button>
                          <Button onClick={handleSubmitObservation} className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 px-10 rounded-2xl shadow-xl shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all">
                            Commit Observation
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {activeView === 'courses' && (
                  <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-12 px-8 rounded-full shadow-lg shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 border-none">
                        <PlusCircle className="h-4 w-4 mr-3" />
                        Propose New Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] shadow-2xl p-10">
                      <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Course Proposal</DialogTitle>
                        <DialogDescription className="text-sm font-semibold text-slate-500 pt-2">
                          Define a new professional development unit for administrative approval
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Curriculum Title</Label>
                          <Input
                            value={courseTitle}
                            onChange={(e) => setCourseTitle(e.target.value)}
                            placeholder="e.g. AI-Enhanced Pedagogy"
                            className="h-14 bg-white/50 border-slate-100 rounded-2xl shadow-sm font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Category</Label>
                            <Select value={courseCategory} onValueChange={setCourseCategory}>
                              <SelectTrigger className="h-14 bg-white/50 border-slate-100 rounded-2xl shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="Professional Development" className="font-bold py-3">Professional Development</SelectItem>
                                <SelectItem value="Technology Integration" className="font-bold py-3">Technology Integration</SelectItem>
                                <SelectItem value="Assessment" className="font-bold py-3">Assessment</SelectItem>
                                <SelectItem value="Pedagogy" className="font-bold py-3">Pedagogy</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Credit Hours</Label>
                            <Input
                              type="number"
                              value={courseHours}
                              onChange={(e) => setCourseHours(e.target.value)}
                              placeholder="4"
                              className="h-14 bg-white/50 border-slate-100 rounded-2xl shadow-sm font-black text-center text-xl text-[#A37FBC]"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Curriculum Specifications</Label>
                          <Textarea
                            value={courseDescription}
                            onChange={(e) => setCourseDescription(e.target.value)}
                            placeholder="Outline learning objectives and curriculum structure..."
                            className="min-h-[140px] bg-white/50 border-slate-100 rounded-3xl p-6 text-sm font-semibold shadow-sm resize-none"
                          />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                          <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8" onClick={() => setCourseDialogOpen(false)}>
                            Discard
                          </Button>
                          <Button onClick={handleSubmitCourse} className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 px-10 rounded-2xl shadow-xl shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all">
                            Submit Proposal
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {activeView === 'observe' && (
              <div className="space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A37FBC]"></div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Oversight Ledger</CardTitle>
                      <div className="text-4xl font-black text-slate-900 mt-2">{myObservations.length}</div>
                      <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">Total Submissions</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Team Performance</CardTitle>
                      <div className="text-4xl font-black text-slate-900 mt-2">
                        {myObservations.length > 0
                          ? (myObservations.reduce((sum, obs) => sum + obs.score, 0) / myObservations.length).toFixed(1)
                          : '0.0'}
                      </div>
                      <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">Avg Precision Score</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Network Health</CardTitle>
                      <div className="text-4xl font-black text-slate-900 mt-2">
                        {teachers.length > 0
                          ? Math.round((teachersWithStats.reduce((sum, t) => sum + t.pdHours, 0) / (teachers.length * 50)) * 100)
                          : 0}%
                      </div>
                      <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">PD Path Completion</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Oversight Activity</h2>
                  </div>
                  <div className="space-y-6">
                    {myObservations.length === 0 ? (
                      <div className="p-20 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-100">
                        <ClipboardCheck className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No administrative records detected</p>
                      </div>
                    ) : (
                      myObservations.map((obs) => (
                        <Card key={obs.id} className="bg-white/60 backdrop-blur-md border-none rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-[#A37FBC]/10 transition-all group overflow-hidden">
                          <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-5">
                                <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-[#A37FBC]/10 group-hover:text-[#A37FBC] transition-colors">
                                  <Users className="h-6 w-6" />
                                </div>
                                <div>
                                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">{obs.teacherName}</CardTitle>
                                  <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                    {new Date(obs.date).toLocaleDateString(undefined, { dateStyle: 'medium' })} <span className="text-[#A37FBC] mx-2">•</span> {obs.domain}
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge
                                className={`rounded-full px-5 py-1 text-[10px] font-black uppercase tracking-widest border-none shadow-sm ${obs.status === 'Reflected'
                                  ? 'bg-emerald-500 text-white'
                                  : obs.status === 'Acknowledged'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-amber-500 text-white'
                                  }`}
                              >
                                {obs.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-8 pt-0">
                            <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-50 mb-6">
                              <div>
                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Observation Precision</p>
                                <p className="text-3xl font-black text-[#A37FBC] tracking-tighter">
                                  {obs.score} <span className="text-xs text-slate-300 font-bold px-1 select-none">/</span> <span className="text-slate-300">5.0</span>
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                className="rounded-full text-[10px] font-black uppercase tracking-widest bg-white shadow-sm border border-slate-100 hover:text-[#A37FBC] transition-transform active:scale-95"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDossier(obs);
                                }}
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Review Dossier
                              </Button>
                            </div>
                            <div className="bg-white/50 p-6 rounded-2xl border border-slate-50 relative">
                              <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-2 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#A37FBC]"></div> Recorded Feedback</p>
                              <p className="text-sm font-semibold text-slate-600 italic tracking-tight leading-relaxed">"{obs.feedback}"</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeView === 'teachers' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Faculty Roster</h2>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative w-full sm:w-64">
                      <Input
                        placeholder="Search Faculty..."
                        value={facultySearch}
                        onChange={(e) => setFacultySearch(e.target.value)}
                        className="h-12 bg-white/60 backdrop-blur-md border-none rounded-2xl shadow-sm px-10 text-xs font-bold"
                      />
                      <Users className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                    <Select value={facultySort} onValueChange={setFacultySort}>
                      <SelectTrigger className="h-12 w-full sm:w-48 bg-white/60 backdrop-blur-md border-none rounded-2xl shadow-sm px-6 text-[10px] font-black uppercase tracking-widest">
                        <SelectValue placeholder="Sort Teachers" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-3xl border-none rounded-2xl shadow-2xl p-2">
                        <SelectItem value="name" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">Identity (A-Z)</SelectItem>
                        <SelectItem value="score" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">Hi-Precision Score</SelectItem>
                        <SelectItem value="pd" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">PD Accumulation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredFaculty.map((teacher) => (
                    <Card key={teacher.empId} className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-[#A37FBC]/10 transition-all group overflow-hidden">
                      <CardHeader className="p-10 pb-6 border-b border-black/[0.02]">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-[#A37FBC]/10 flex items-center justify-center text-[#A37FBC] font-black text-xl border border-[#A37FBC]/10 shadow-inner">
                              {teacher.name[0]}
                            </div>
                            <div>
                              <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{teacher.name}</CardTitle>
                              <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {teacher.empId} <span className="text-[#A37FBC] mx-2">•</span> {teacher.campus}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Avg Score</p>
                            <p className="text-3xl font-black text-emerald-500 tracking-tighter">{teacher.avgScore}<span className="text-sm text-slate-300 font-bold ml-1">/5.0</span></p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-10 space-y-8 pt-8">
                        <div className="grid grid-cols-3 gap-6">
                          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Evaluations</p>
                            <p className="text-2xl font-black text-slate-900">{teacher.observations}</p>
                          </div>
                          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50 text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">PD Credits</p>
                            <p className="text-2xl font-black text-slate-900">{teacher.pdHours}<span className="text-xs text-slate-300 ml-1">/{teacher.targetHours}</span></p>
                          </div>
                          <div className="bg-[#A37FBC]/5 p-4 rounded-2xl border border-[#A37FBC]/10 text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Completion</p>
                            <p className="text-2xl font-black text-[#A37FBC]">{Math.round((teacher.pdHours / teacher.targetHours) * 100)}%</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="text-slate-400">Teacher Participation Velocity</span>
                            <span className="text-[#A37FBC]">{Math.round((teacher.pdHours / teacher.targetHours) * 100)}%</span>
                          </div>
                          <Progress value={(teacher.pdHours / teacher.targetHours) * 100} className="h-2 bg-[#A37FBC]/10" />
                        </div>
                        <div className="flex gap-4">
                          <Button
                            variant="ghost"
                            className="flex-1 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm text-[10px] font-black uppercase tracking-widest transition-all"
                            onClick={() => handleViewVector(teacher)}
                          >
                            View Vector
                          </Button>
                          <Button
                            className="flex-1 h-12 rounded-2xl bg-[#A37FBC] hover:bg-[#8e6ba8] text-white shadow-lg shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest border-none transition-all"
                            onClick={() => handleSetGoal(teacher)}
                          >
                            Set Goals
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'pd-participation' && (
              <div className="space-y-12">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Professional Development Analytics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A37FBC]"></div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">School Participation</CardTitle>
                      <div className="text-4xl font-black text-slate-900 mt-2">{avgPdRate}%</div>
                      <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">Average Attendance Rate</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Events Conducted</CardTitle>
                      <div className="text-4xl font-black text-slate-900 mt-2">{getTrainingEvents().filter(e => e.status !== 'Upcoming').length}</div>
                      <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">Workshops & Seminars</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                    <CardHeader className="p-8">
                      <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Leading Campus</CardTitle>
                      <div className="text-2xl font-black text-slate-900 mt-2 tracking-tight">City Campus</div>
                      <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">Highest Engagement</CardDescription>
                    </CardHeader>
                  </Card>
                </div>

                <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden">
                  <CardHeader className="p-10 border-b border-black/[0.02]">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Participation Report</CardTitle>
                        <CardDescription className="text-sm font-semibold text-slate-400 mt-1 uppercase tracking-widest">Faculty Attendance & Engagement</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-black/[0.03]">
                          <TableHead className="pl-10 font-black uppercase text-[10px] text-slate-400 tracking-widest">Faculty Name</TableHead>
                          <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Campus</TableHead>
                          <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest">Events Attended</TableHead>
                          <TableHead className="font-black uppercase text-[10px] text-slate-400 tracking-widest w-1/3">Participation Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pdStats.map((t) => (
                          <TableRow key={t.empId} className="border-b border-black/[0.01] hover:bg-[#A37FBC]/[0.02] transition-colors group">
                            <TableCell className="pl-10">
                              <div className="font-black text-slate-900 tracking-tight">{t.name}</div>
                              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">{t.designation}</div>
                            </TableCell>
                            <TableCell className="font-bold text-slate-500 text-xs">{t.campus}</TableCell>
                            <TableCell className="font-black text-slate-900 text-xs">
                              {t.attended} <span className="text-slate-300">/</span> {t.totalEvents}
                            </TableCell>
                            <TableCell className="pr-10">
                              <div className="flex items-center gap-4">
                                <Progress value={t.rate} className="h-2 bg-slate-100 flex-1" />
                                <span className="text-xs font-black text-[#A37FBC] w-8">{t.rate}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeView === 'courses' && (
              <div className="space-y-12">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active & Pending Curriculum</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {allCourses.map((course) => (
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
                      <CardContent className="p-10 space-y-6">
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {activeView === 'reports' && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Campus Analytics Dossier</h2>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Select value={reportTimeframe} onValueChange={setReportTimeframe}>
                      <SelectTrigger className="h-12 w-full sm:w-48 bg-white/60 backdrop-blur-md border-none rounded-2xl shadow-sm px-6 text-[10px] font-black uppercase tracking-widest">
                        <SelectValue placeholder="Timeframe" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-3xl border-none rounded-2xl shadow-2xl p-2">
                        <SelectItem value="all" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">All Time</SelectItem>
                        <SelectItem value="30days" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">Last 30 Days</SelectItem>
                        <SelectItem value="q1" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">Academic Q1</SelectItem>
                        <SelectItem value="ytd" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">Year to Date</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={reportCampus} onValueChange={setReportCampus}>
                      <SelectTrigger className="h-12 w-full sm:w-48 bg-white/60 backdrop-blur-md border-none rounded-2xl shadow-sm px-6 text-[10px] font-black uppercase tracking-widest">
                        <SelectValue placeholder="Campus" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-3xl border-none rounded-2xl shadow-2xl p-2">
                        <SelectItem value="all" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">All Campuses</SelectItem>
                        <SelectItem value="City Campus" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">City Campus</SelectItem>
                        <SelectItem value="BTM Campus" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">BTM Campus</SelectItem>
                        <SelectItem value="JPN Campus" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">JPN Campus</SelectItem>
                        <SelectItem value="Nice Road Campus" className="rounded-xl text-[10px] font-black uppercase tracking-widest p-4">Nice Road</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Domain Proficiency Card */}
                  <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[3rem] shadow-sm p-10">
                    <CardHeader className="p-0 mb-8">
                      <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#A37FBC]"></div>
                        Domain Proficiency Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-6">
                      {[
                        { domain: 'Curriculum & Planning', score: 4.2 },
                        { domain: 'Instructional Delivery', score: 3.8 },
                        { domain: 'Assessment for Learning', score: 4.5 },
                        { domain: 'Learning Environment', score: 4.1 },
                        { domain: 'Professional Responsibility', score: 4.8 }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-500">{item.domain}</span>
                            <span className="text-[#A37FBC]">{item.score}/5.0</span>
                          </div>
                          <Progress value={(item.score / 5) * 100} className="h-1.5 bg-[#A37FBC]/5" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Growth Participation Card */}
                  <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[3rem] shadow-sm p-10">
                    <CardHeader className="p-0 mb-8">
                      <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Professional Growth Velocity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-10">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">Campus PD Accumulation</p>
                        <div className="text-6xl font-black text-slate-900 tracking-tighter">
                          {teachersWithStats.reduce((sum, t) => sum + t.pdHours, 0)}
                          <span className="text-xl text-[#A37FBC] font-black ml-2 uppercase tracking-tight">Hrs</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50 text-center">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Active Goals</p>
                          <p className="text-2xl font-black text-slate-900">
                            {teachersWithStats.reduce((sum, t) => sum + (getGoalsByTeacher(t.empId).length > 0 ? 1 : 0), 0)}
                          </p>
                        </div>
                        <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50 text-center">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">PDI Efficiency</p>
                          <p className="text-2xl font-black text-emerald-500">92%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[3rem] shadow-sm p-10">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Generate Terminal Insight Report</h3>
                      <p className="text-sm font-semibold text-slate-500 leading-relaxed mb-6">
                        Compile all pedagogical telemetry, observation records, and professional growth vectors for this campus into a high-fidelity PDF dossier.
                      </p>
                      <Button className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 px-10 rounded-2xl shadow-xl shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all">
                        <FileText className="h-4 w-4 mr-3" />
                        Export High-Fidelity Report
                      </Button>
                    </div>
                    <div className="w-full md:w-64 aspect-square bg-indigo-50 rounded-[2.5rem] flex items-center justify-center p-8 border border-indigo-100 shadow-inner">
                      <BarChart3 className="h-24 w-24 text-indigo-200" />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Set Goal Dialog */}
            <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
              <DialogContent className="max-w-xl bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] shadow-2xl p-10">
                <DialogHeader className="mb-8">
                  <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Assign Goal Vector</DialogTitle>
                  <DialogDescription className="text-sm font-semibold text-slate-500 pt-2">
                    Define a professional development objective for {selectedTeacherForAction?.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Goal Title</Label>
                    <Input
                      value={goalTitle}
                      onChange={(e) => setGoalTitle(e.target.value)}
                      placeholder="e.g. Master Differentiated Instruction"
                      className="h-14 bg-white/50 border-slate-100 rounded-2xl shadow-sm font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Target Completion Date</Label>
                    <Input
                      type="date"
                      value={goalTargetDate}
                      onChange={(e) => setGoalTargetDate(e.target.value)}
                      className="h-14 bg-white/50 border-slate-100 rounded-2xl shadow-sm font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Execution Strategy</Label>
                    <Textarea
                      value={goalDescription}
                      onChange={(e) => setGoalDescription(e.target.value)}
                      placeholder="Detail the steps and criteria for achieving this objective..."
                      className="min-h-[140px] bg-white/50 border-slate-100 rounded-3xl p-6 text-sm font-semibold shadow-sm resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8" onClick={() => setGoalDialogOpen(false)}>
                      Abort
                    </Button>
                    <Button onClick={handleSubmitGoal} className="bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 px-10 rounded-2xl shadow-xl shadow-[#A37FBC]/20 text-[10px] font-black uppercase tracking-widest transition-all">
                      Assign Vector
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Teacher Vector Dialog */}
            <Dialog open={vectorDialogOpen} onOpenChange={setVectorDialogOpen}>
              <DialogContent className="max-w-4xl h-[90vh] bg-[#fdfdfd] border-none rounded-[3rem] shadow-2xl p-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="p-12 space-y-12">
                    <DialogHeader>
                      <div className="flex items-center gap-8">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-[#A37FBC]/10 flex items-center justify-center text-[#A37FBC] font-black text-4xl border border-[#A37FBC]/10 shadow-inner">
                          {selectedTeacherForAction?.name[0]}
                        </div>
                        <div>
                          <DialogTitle className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-3">{selectedTeacherForAction?.name}</DialogTitle>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="text-[10px] font-black text-[#A37FBC] border-[#A37FBC]/20 px-3 rounded-full uppercase tracking-widest bg-[#A37FBC]/5">
                              Teacher Profile
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                              Vector: {selectedTeacherForAction?.empId}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="grid grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-50 flex flex-col items-center justify-center text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mb-3">Precision Avg</p>
                        <p className="text-3xl font-black text-[#A37FBC] leading-none mb-1">{selectedTeacherForAction?.avgScore}</p>
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">/ 5.0</p>
                      </div>
                      <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-50 flex flex-col items-center justify-center text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mb-3">Observation Records</p>
                        <p className="text-3xl font-black text-slate-900 leading-none">{selectedTeacherForAction?.observations}</p>
                      </div>
                      <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-50 flex flex-col items-center justify-center text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mb-3">PD Credits</p>
                        <p className="text-3xl font-black text-slate-900 leading-none mb-1">{selectedTeacherForAction?.pdHours}</p>
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">/ 50</p>
                      </div>
                      <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-slate-50 flex flex-col items-center justify-center text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mb-3">Path Progress</p>
                        <p className="text-3xl font-black text-emerald-500 leading-none">{Math.round((selectedTeacherForAction?.pdHours / 50) * 100)}%</p>
                      </div>
                    </div>

                    <div className="space-y-12">
                      <section>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#A37FBC]"></div>
                          Professional Objectives
                        </h4>
                        <div className="space-y-4">
                          {selectedTeacherForAction && getGoalsByTeacher(selectedTeacherForAction.empId).length === 0 ? (
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest py-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">No active growth vectors assigned</p>
                          ) : (
                            selectedTeacherForAction && getGoalsByTeacher(selectedTeacherForAction.empId).map(goal => (
                              <div key={goal.id} className="p-8 bg-white border border-slate-50 rounded-[2.5rem] shadow-sm group hover:border-[#A37FBC]/20 transition-all space-y-6">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight">{goal.title}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: {goal.status} <span className="text-[#A37FBC] mx-2">•</span> Target: {new Date(goal.target).toLocaleDateString()}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Velocity</p>
                                    <p className="text-lg font-black text-[#A37FBC]">{goal.progress}%</p>
                                  </div>
                                </div>
                                <div className="relative w-full h-2 bg-[#A37FBC]/10 rounded-full overflow-hidden">
                                  <div
                                    className="absolute top-0 left-0 h-full bg-[#A37FBC] transition-all duration-1000"
                                    style={{ width: `${goal.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </section>

                      <section>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          Observation History
                        </h4>
                        <div className="space-y-4">
                          {selectedTeacherForAction && getObservationsByTeacher(selectedTeacherForAction.empId).length === 0 ? (
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest py-8 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">No telemetry records available</p>
                          ) : (
                            selectedTeacherForAction && getObservationsByTeacher(selectedTeacherForAction.empId).map(obs => (
                              <div key={obs.id} className="p-6 bg-white border border-slate-50 rounded-3xl shadow-sm group hover:border-indigo-100 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h5 className="font-black text-slate-900 uppercase tracking-tight">{obs.domain}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(obs.date).toLocaleDateString()} <span className="mx-2">•</span> Observer: {obs.observerName}</p>
                                  </div>
                                  <div className="text-xl font-black text-[#A37FBC]">{obs.score}<span className="text-[10px] text-slate-300 ml-1">/5.0</span></div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-xs font-medium text-slate-500 italic leading-relaxed flex-1 mr-8">"{obs.feedback}"</p>
                                  <Button
                                    variant="ghost"
                                    className="rounded-full text-[9px] font-black uppercase tracking-widest bg-white shadow-sm border border-slate-100 hover:text-[#A37FBC] px-4"
                                    onClick={() => handleViewDossier(obs)}
                                  >
                                    Review Dossier
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </section>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* Pedagogy Dossier Dialog */}
            <Dialog open={dossierDialogOpen} onOpenChange={setDossierDialogOpen}>
              <DialogContent className="max-w-5xl bg-white/95 backdrop-blur-3xl border-none rounded-[3.5rem] shadow-2xl p-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#A37FBC] to-indigo-500"></div>

                <div className="p-12 space-y-10">
                  <DialogHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="w-10 h-[2px] bg-[#A37FBC] rounded-full"></span>
                          <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em]">Pedagogical Asset</p>
                        </div>
                        <DialogTitle className="text-4xl font-black text-slate-900 uppercase tracking-tight">Oversight Dossier</DialogTitle>
                      </div>
                      <Badge
                        className={`rounded-2xl px-6 py-2 text-[10px] font-black uppercase tracking-widest border-none shadow-xl ${selectedObservationForDossier?.status === 'Reflected' ? 'bg-emerald-500/10 text-emerald-600' :
                          selectedObservationForDossier?.status === 'Acknowledged' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-amber-500/10 text-amber-600'
                          }`}
                      >
                        {selectedObservationForDossier?.status}
                      </Badge>
                    </div>
                  </DialogHeader>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                        <div className="flex items-center gap-5 mb-6">
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#A37FBC] font-black border border-slate-100 shadow-sm">
                            <Users className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Assessed Identity</p>
                            <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedObservationForDossier?.teacherName}</h5>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <ClipboardCheck className="h-4 w-4 text-[#A37FBC]" />
                            <span>{selectedObservationForDossier?.domain}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <FileText className="h-4 w-4 text-[#A37FBC]" />
                            <span>Recorded: {selectedObservationForDossier?.date}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <Users className="h-4 w-4 text-[#A37FBC]" />
                            <span>Observer: {selectedObservationForDossier?.observerName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Precision Metric</p>
                          <p className="text-5xl font-black text-slate-900 tracking-tighter">
                            {selectedObservationForDossier?.score}
                            <span className="text-xl text-slate-300 ml-2">/ 5.0</span>
                          </p>
                        </div>
                        <div className="w-20 h-20 rounded-full border-8 border-slate-50 flex items-center justify-center relative">
                          <svg className="w-full h-full -rotate-90 origin-center overflow-visible">
                            <circle
                              cx="40"
                              cy="40"
                              r="36"
                              fill="none"
                              stroke="#A37FBC"
                              strokeWidth="8"
                              strokeDasharray={`${(selectedObservationForDossier?.score / 5) * 226} 226`}
                              strokeLinecap="round"
                              className="transition-all duration-1000"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-[#A37FBC] animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col h-full bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group/feedback shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#A37FBC]/10 rounded-full blur-[60px] group-hover/feedback:bg-[#A37FBC]/20 transition-all duration-700"></div>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-[#A37FBC]" />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tactical Insights</p>
                        </div>
                        <ScrollArea className="flex-1 pr-4">
                          <p className="text-base font-medium leading-relaxed italic text-slate-200">
                            "{selectedObservationForDossier?.feedback}"
                          </p>
                        </ScrollArea>
                        <div className="pt-8 mt-auto border-t border-white/5">
                          <p className="text-[9px] font-black text-[#A37FBC] uppercase tracking-[0.4em]">End of Record</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => setDossierDialogOpen(false)}
                      className="bg-slate-900 hover:bg-black text-white px-12 h-16 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200"
                    >
                      Dismiss Dossier
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* Mini Footer */}
        <footer className="bg-white/40 backdrop-blur-md border-t border-black/[0.03] py-8 px-8 text-center text-slate-400 text-[10px] z-20 font-bold uppercase tracking-[0.4em]">
          <p>&copy; {new Date().getFullYear()} EKYA SCHOOL PDI <span className="text-[#A37FBC] mx-2">•</span> THE PINNACLE OF PD</p>
        </footer>
      </main>
    </div>
  );
}
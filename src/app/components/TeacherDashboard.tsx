import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Progress } from '@/app/components/ui/progress';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Textarea } from '@/app/components/ui/textarea';
import { LogOut, BookOpen, Calendar, Target, MessageSquare, CheckCircle, LucideIcon, ChevronRight, ArrowLeft, CheckCircle2, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import { Separator } from '@/app/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/app/components/ui/dialog';
import { Users, ClipboardCheck, FileText } from 'lucide-react';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    isAuthenticated,
    logout,
    getObservationsByTeacher,
    getEnrollmentsByTeacher,
    getCourses,
    getTrainingEventsByCampus,
    getGoalsByTeacher,
    getTotalPDHours,
    getPDHoursByTeacher,
    addCourseEnrollment,
    getTrainingAttendanceByTeacher,
    addTrainingAttendance,
    markAttendance,
    updateObservation,
  } = useApp();

  const [activeView, setActiveView] = useState('observations');
  const [reflections, setReflections] = useState<{ [key: string]: string }>({});
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [dossierDialogOpen, setDossierDialogOpen] = useState(false);
  const [selectedObservationForDossier, setSelectedObservationForDossier] = useState<any>(null);
  const [pendingReg, setPendingReg] = useState<{ id: string, type: 'course' | 'training', title: string, hours?: number, date?: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/login/teacher', { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  if (!currentUser) return null;

  const observations = getObservationsByTeacher(currentUser.empId);
  const enrollments = getEnrollmentsByTeacher(currentUser.empId);
  const allCourses = getCourses();
  const publishedCourses = allCourses.filter(c => c.status === 'Published');
  const trainingEvents = getTrainingEventsByCampus(currentUser.campus);
  const goals = getGoalsByTeacher(currentUser.empId);
  const totalPDHours = getTotalPDHours(currentUser.empId);
  const targetPDHours = 50;
  const pdPercentage = Math.round((totalPDHours / targetPDHours) * 100);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleSaveReflection = (observationId: string) => {
    const reflection = reflections[observationId];
    if (reflection) {
      updateObservation(observationId, {
        reflection,
        status: 'Reflected',
      });
    }
  };

  const handleRegisterTraining = (event: any) => {
    setPendingReg({
      id: event.id,
      type: 'training',
      title: event.title,
      date: event.date,
      hours: 2 // default or from data if available
    });
    setRegModalOpen(true);
  };

  const handleRegisterCourse = (course: any) => {
    setPendingReg({
      id: course.id,
      type: 'course',
      title: course.title,
      hours: course.hours
    });
    setRegModalOpen(true);
  };

  const confirmRegistration = () => {
    if (!pendingReg) return;

    if (pendingReg.type === 'training') {
      addTrainingAttendance({
        eventId: pendingReg.id,
        teacherId: currentUser.empId,
        registrationDate: new Date().toISOString().split('T')[0],
        attended: false,
      });
    } else {
      addCourseEnrollment({
        courseId: pendingReg.id,
        teacherId: currentUser.empId,
        enrollmentDate: new Date().toISOString().split('T')[0],
        progress: 0,
        status: 'Not Started'
      });
    }

    setRegModalOpen(false);
    setPendingReg(null);
  };

  const getTrainingStatus = (eventId: string) => {
    const attendance = getTrainingAttendanceByTeacher(currentUser.empId);
    const registration = attendance.find(atd => atd.eventId === eventId);
    if (registration) {
      return registration.attended ? 'Attended' : 'Registered';
    }
    return null;
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-emerald-600';
    if (score >= 4.0) return 'text-[#A37FBC]';
    if (score >= 3.5) return 'text-amber-600';
    return 'text-rose-600';
  };

  const handleViewDossier = (obs: any) => {
    setSelectedObservationForDossier(obs);
    setDossierDialogOpen(true);
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
              <h2 className="text-sm font-black text-slate-900 tracking-tighter uppercase mb-0.5">Teacher Central</h2>
              <p className="text-[9px] text-[#A37FBC] font-black tracking-[0.3em] uppercase opacity-70">Ekya School PDI</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6">
          <SidebarItem id="observations" label="Observations" icon={MessageSquare} />
          <SidebarItem id="training" label="Training" icon={Calendar} />
          <SidebarItem id="courses" label="Courses" icon={BookOpen} />
          <SidebarItem id="goals" label="Goals" icon={Target} />
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
          <h2 className="text-sm font-black text-[#A37FBC] uppercase tracking-[0.3em]">Growth Hub</h2>
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
                  <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em]">Dashboard Telemetry</p>
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                  {activeView}
                </h1>
              </div>
              <div className="flex items-center gap-8">
                <button
                  onClick={() => setActiveView('pd-report')}
                  className="flex items-center gap-8 border-r border-black/[0.03] pr-8 mr-2 hover:bg-slate-50/50 p-2 rounded-2xl transition-all group"
                >
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest group-hover:text-[#A37FBC] transition-colors">PD Accumulation</p>
                    <p className="text-lg font-black text-[#A37FBC] tracking-tight">{totalPDHours} <span className="text-slate-300">/</span> {targetPDHours} hrs</p>
                  </div>
                  <div className="w-32">
                    <Progress value={pdPercentage} className="h-2 bg-[#A37FBC]/10" />
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-12 w-12 rounded-2xl bg-white/50 border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">

            {/* View Content */}
            <div className="space-y-8">
              {activeView === 'observations' && (
                <div className="space-y-12">
                  {/* Quick Access Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-[#A37FBC]"></div>
                      <CardHeader className="pb-2 p-8">
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Telemetry Summary</CardTitle>
                        <div className="text-4xl font-black text-slate-900 mt-2">{observations.length}</div>
                        <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">Total Observations</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                      <CardHeader className="pb-2 p-8">
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Vectors</CardTitle>
                        <div className="text-4xl font-black text-slate-900 mt-2">{goals.length}</div>
                        <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">Professional Goals</CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                      <CardHeader className="pb-2 p-8">
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Growth Status</CardTitle>
                        <div className="text-4xl font-black text-slate-900 mt-2">{pdPercentage}%</div>
                        <CardDescription className="text-xs font-bold text-slate-500 pt-2 uppercase tracking-wide">Path Completion</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>

                  <Card className="bg-transparent border-none shadow-none">
                    <CardHeader className="p-0 mb-8">
                      <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Observation Ledger</CardTitle>
                      <CardDescription className="text-sm font-semibold text-slate-400">Tactical feedback and pedagogical insights</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-6">
                        {observations.length === 0 ? (
                          <div className="p-20 text-center bg-white/40 rounded-[2rem] border-2 border-dashed border-slate-100">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active records detected</p>
                          </div>
                        ) : (
                          observations.map((obs) => (
                            <Card key={obs.id} className="bg-white/60 backdrop-blur-md border-none rounded-[2.5rem] shadow-[0_4px_25px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgb(163,127,188,0.08)] transition-all duration-500 group overflow-hidden">
                              <CardHeader className="p-10 pb-6 border-b border-black/[0.02]">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="p-2 bg-[#A37FBC]/10 rounded-xl">
                                        <MessageSquare className="h-4 w-4 text-[#A37FBC]" />
                                      </span>
                                      <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">{obs.domain}</CardTitle>
                                    </div>
                                    <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      Observer: <span className="text-slate-600 underline decoration-[#A37FBC]/30">{obs.observerName}</span> • {new Date(obs.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    </CardDescription>
                                  </div>
                                  <div className="flex gap-2">
                                    {obs.tags.map((tag) => (
                                      <Badge key={tag} className="bg-slate-50 text-slate-400 hover:bg-slate-100 border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-10 space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                  <div className="space-y-6">
                                    <div>
                                      <div className="flex items-center justify-between mb-3 px-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precision Score</span>
                                        <div className="flex items-center gap-4">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 rounded-full text-[9px] font-black uppercase tracking-widest bg-white shadow-sm border border-slate-100 hover:text-[#A37FBC] px-4"
                                            onClick={() => handleViewDossier(obs)}
                                          >
                                            Review Dossier
                                          </Button>
                                          <span className={`text-2xl font-black ${getScoreColor(obs.score)} tracking-tighter`}>
                                            {obs.score} <span className="text-slate-300">/</span> 5.0
                                          </span>
                                        </div>
                                      </div>
                                      <Progress value={(obs.score / 5) * 100} className="h-1.5 bg-slate-100" />
                                    </div>
                                    <div className="space-y-3">
                                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <CheckCircle className="h-3 w-3" /> Tactical Feedback
                                      </h4>
                                      <p className="text-sm text-slate-600 leading-relaxed font-semibold bg-slate-50/50 p-6 rounded-2xl border border-slate-50">{obs.feedback}</p>
                                    </div>
                                  </div>
                                  <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                      <ArrowLeft className="h-3 w-3" /> Introspective Reflection
                                    </h4>
                                    {obs.reflection ? (
                                      <div className="bg-[#A37FBC]/5 rounded-[2rem] p-8 border border-[#A37FBC]/10 relative overflow-hidden group-hover:bg-[#A37FBC]/10 transition-colors duration-500">
                                        <p className="text-sm text-slate-700 leading-relaxed font-bold tracking-tight">{obs.reflection}</p>
                                        <Badge className="mt-6 bg-[#A37FBC] text-white hover:bg-[#A37FBC] rounded-full px-4 text-[9px] font-black uppercase tracking-widest border-none shadow-sm">Verified Reflection</Badge>
                                      </div>
                                    ) : (
                                      <div className="space-y-4">
                                        <Textarea
                                          placeholder="Add your precision reflection on this session..."
                                          value={reflections[obs.id] || ''}
                                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setReflections({ ...reflections, [obs.id]: e.target.value })
                                          }
                                          className="min-h-[140px] bg-white border-slate-100 focus:border-[#A37FBC] rounded-3xl p-6 text-sm font-semibold shadow-inner"
                                        />
                                        <Button
                                          className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-12 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#A37FBC]/20 transition-all active:scale-95 border-none"
                                          onClick={() => handleSaveReflection(obs.id)}
                                          disabled={!reflections[obs.id]}
                                        >
                                          <CheckCircle className="h-4 w-4 mr-3" />
                                          Commit Reflection
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeView === 'training' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {trainingEvents.map((event) => {
                    const status = getTrainingStatus(event.id);
                    return (
                      <Card key={event.id} className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm hover:shadow-xl hover:shadow-[#A37FBC]/10 transition-all p-10 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#A37FBC]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="space-y-1">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-[#A37FBC] transition-colors">{event.title}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.topic}</p>
                          </div>
                          <Badge className={`border-none rounded-full px-5 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${status === 'Attended' ? 'bg-emerald-500 text-white' :
                            status === 'Registered' ? 'bg-[#A37FBC] text-white' :
                              'bg-[#A37FBC]/10 text-[#A37FBC]'
                            }`}>
                            {status || event.status}
                          </Badge>
                        </div>
                        <div className="space-y-5 mb-10 relative z-10">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                              <Calendar className="h-5 w-5 text-[#A37FBC]" />
                            </div>
                            <span className="text-sm font-black text-slate-600 uppercase tracking-tight">
                              {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                              <span className="text-[#A37FBC] mx-2">•</span>
                              {event.time}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => event.status === 'Open' && !status && handleRegisterTraining(event.id)}
                          disabled={event.status !== 'Open' || !!status}
                          className={`w-full rounded-2xl h-14 text-xs font-black uppercase tracking-widest transition-all shadow-xl border-none relative z-10 ${status === 'Attended' ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' :
                            status === 'Registered' ? 'bg-slate-100 text-slate-400 shadow-none cursor-default' :
                              event.status === 'Open' ? 'bg-[#A37FBC] hover:bg-[#8e6ba8] text-white shadow-[#A37FBC]/20' :
                                'bg-slate-100 text-slate-400 shadow-none'
                            }`}
                        >
                          {status === 'Attended' ? 'Training Completed' :
                            status === 'Registered' ? 'Successfully Registered' :
                              event.status === 'Open' ? 'Initialize Registration' :
                                'Registration Closed'}
                        </Button>
                        {status === 'Registered' && new Date() >= new Date(event.date) && (
                          <Button
                            onClick={() => {
                              const attendance = getTrainingAttendanceByTeacher(currentUser.empId).find(a => a.eventId === event.id);
                              if (attendance) markAttendance(attendance.id, true);
                            }}
                            className="w-full mt-2 rounded-2xl h-14 text-xs font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 shadow-xl border-none"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm Attendance
                          </Button>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}

              {activeView === 'courses' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {publishedCourses.length === 0 ? (
                    <div className="col-span-full p-20 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-100">
                      <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No certified curriculum modules detected</p>
                    </div>
                  ) : (
                    publishedCourses.map((course) => (
                      <Card key={course.id} className="bg-white/60 backdrop-blur-md border-none rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:shadow-[#A37FBC]/10 transition-all group overflow-hidden">
                        <CardHeader className="p-10 pb-6 border-b border-black/[0.02]">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-[1.5rem] bg-[#A37FBC]/10 flex items-center justify-center text-[#A37FBC] font-black text-xl border border-[#A37FBC]/10 shadow-inner">
                                <BookOpen className="h-8 w-8" />
                              </div>
                              <div>
                                <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-[#A37FBC] transition-colors">{course.title}</CardTitle>
                                <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                  {course.id} <span className="text-[#A37FBC] mx-2">•</span> {course.category}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge className="bg-emerald-500 text-white border-none rounded-full px-5 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">Certified</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                          <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/50 -mr-12 -mt-12 rounded-full"></div>
                            <p className="text-sm font-semibold text-slate-600 italic tracking-tight relative z-10 leading-relaxed">"{course.description}"</p>
                          </div>
                          <div className="grid grid-cols-2 gap-6 pb-2">
                            <div className="flex flex-col gap-1 p-5 bg-white/50 rounded-[2rem] border border-black/[0.01]">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Credit Weight</span>
                              <span className="text-xl font-black text-slate-900">{course.hours} HRS</span>
                            </div>
                            <div className="flex flex-col gap-1 p-5 bg-white/50 rounded-[2rem] border border-black/[0.01]">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Pre-Req</span>
                              <span className="text-xs font-black text-[#A37FBC] truncate uppercase tracking-tight">{course.prerequisites}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleRegisterCourse(course)}
                            className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] text-white rounded-2xl h-14 text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-[#A37FBC]/20 border-none"
                          >
                            Begin Enrollment Vector
                          </Button>
                        </CardContent>
                      </Card>
                    )
                    ))}
                </div>
              )}

              {activeView === 'goals' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    {goals.map((goal) => (
                      <Card key={goal.id} className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm p-10 group overflow-hidden relative">
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl ${goal.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600 shadow-inner'}`}>
                              <Target className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{goal.title}</h3>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Deadline: {new Date(goal.target).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Badge className={`${goal.status === 'Completed' ? 'bg-emerald-500' : 'bg-[#A37FBC]'} text-white border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg`}>{goal.status}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeView === 'pd-report' && (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Professional Growth Ledger</h2>
                      <p className="text-sm font-semibold text-slate-400 mt-2">Comprehensive history of professional development accumulation</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setActiveView('observations')}
                      className="h-12 px-6 rounded-2xl border-slate-100 font-black text-[10px] uppercase tracking-widest"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2.5rem] shadow-sm p-8 text-center flex flex-col items-center justify-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Total PD Hours</p>
                      <p className="text-4xl font-black text-[#A37FBC] tracking-tight">{totalPDHours}</p>
                    </Card>
                    <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2.5rem] shadow-sm p-8 text-center flex flex-col items-center justify-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Hours</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tight">{targetPDHours}</p>
                    </Card>
                    <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2.5rem] shadow-sm p-8 text-center flex flex-col items-center justify-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Completion</p>
                      <p className="text-4xl font-black text-emerald-500 tracking-tight">{pdPercentage}%</p>
                    </Card>
                    <Card className="bg-white/60 backdrop-blur-2xl border-none rounded-[2.5rem] shadow-sm p-8 text-center flex flex-col items-center justify-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Record Count</p>
                      <p className="text-4xl font-black text-indigo-500 tracking-tight">{getPDHoursByTeacher(currentUser.empId).length}</p>
                    </Card>
                  </div>

                  <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-black/[0.02] bg-slate-50/30">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#A37FBC]"></div>
                        Chronological PD History
                      </h3>
                    </div>
                    <div className="p-0">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-black/[0.02]">
                            <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Date</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Growth Activity</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                            <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-400">Credit (HRS)</th>
                            <th className="p-8 text-right pr-12 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPDHoursByTeacher(currentUser.empId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((record) => (
                            <tr key={record.id} className="border-b border-black/[0.01] hover:bg-slate-50/50 transition-all">
                              <td className="p-8 text-sm font-bold text-slate-500">{new Date(record.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                              <td className="p-8 text-sm font-black text-slate-900 uppercase tracking-tight">{record.activityName}</td>
                              <td className="p-8">
                                <Badge variant="outline" className="rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border-slate-100 text-slate-400">{record.activityType}</Badge>
                              </td>
                              <td className="p-8 text-sm font-black text-[#A37FBC]">{record.hours} HRS</td>
                              <td className="p-8 text-right pr-12">
                                <div className="flex justify-end">
                                  <Badge className={`rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-none ${record.status === 'Completed' ? 'bg-emerald-500 text-white' :
                                    record.status === 'In Progress' ? 'bg-amber-500 text-white' : 'bg-slate-300 text-white'
                                    }`}>
                                    {record.status}
                                  </Badge>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mini Footer */}
        <footer className="bg-white/40 backdrop-blur-md border-t border-black/[0.03] py-8 px-8 text-center text-slate-400 text-[10px] z-20 font-bold uppercase tracking-[0.4em]">
          <p>&copy; {new Date().getFullYear()} EKYA SCHOOL PDI <span className="text-[#A37FBC] mx-2">•</span> EXCELLENCE THROUGH PRECISION</p>
        </footer>

        <Dialog open={regModalOpen} onOpenChange={setRegModalOpen}>
          <DialogContent className="max-w-xl bg-white/95 backdrop-blur-3xl border-none rounded-[3rem] shadow-2xl p-12">
            <DialogHeader className="mb-10 text-center">
              <div className="w-20 h-20 bg-[#A37FBC]/10 rounded-[2rem] flex items-center justify-center text-[#A37FBC] mx-auto mb-6 border border-[#A37FBC]/10">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight">Protocol Confirmation</DialogTitle>
              <DialogDescription className="text-sm font-semibold text-slate-500 pt-2 uppercase tracking-widest">
                Professional Growth Vector Verification
              </DialogDescription>
            </DialogHeader>

            {pendingReg && (
              <div className="space-y-8 mb-10">
                <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
                  <span className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.3em] mb-3">{pendingReg.type} Detail</span>
                  <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-4">{pendingReg.title}</h4>

                  <div className="flex gap-6 mt-2">
                    <div className="flex items-center gap-2 text-slate-500 bg-white/50 px-4 py-2 rounded-full border border-black/[0.02]">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{pendingReg.hours} Hours credited</span>
                    </div>
                    {pendingReg.date && (
                      <div className="flex items-center gap-2 text-slate-500 bg-white/50 px-4 py-2 rounded-full border border-black/[0.02]">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(pendingReg.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-[#A37FBC]/5 rounded-3xl border border-[#A37FBC]/10">
                  <UserCheck className="h-5 w-5 text-[#A37FBC] mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Identity Acknowledgment</p>
                    <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                      I, <span className="text-[#A37FBC] font-black">{currentUser.name}</span>, confirm my intent to initialize this professional development module. I acknowledge that completion will be recorded in my pedagogical telemetry.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-4">
              <Button variant="ghost" onClick={() => { setRegModalOpen(false); setPendingReg(null); }} className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600">
                Abort Protocol
              </Button>
              <Button onClick={confirmRegistration} className="flex-[1.5] bg-[#A37FBC] hover:bg-[#8e6ba8] text-white h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#A37FBC]/20 transition-all border-none">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Identity & Register
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Pedagogy Dossier Dialog */}
        <Dialog open={dossierDialogOpen} onOpenChange={setDossierDialogOpen}>
          <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-3xl border-none rounded-[3.5rem] shadow-2xl p-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#A37FBC] to-indigo-500"></div>

            <div className="p-12 space-y-10">
              <DialogHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-3 text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="w-10 h-[2px] bg-[#A37FBC] rounded-full"></span>
                      <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em]">Personal Pedagogical Asset</p>
                    </div>
                    <DialogTitle className="text-4xl font-black text-slate-900 uppercase tracking-tight">Professional Dossier</DialogTitle>
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
                <div className="space-y-8 text-left">
                  <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <div className="flex items-center gap-5 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#A37FBC] font-black border border-slate-100 shadow-sm">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Assessed Identity</p>
                        <h5 className="text-xl font-black text-slate-900 uppercase tracking-tight">{currentUser.name}</h5>
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
                    <div className="text-left">
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
                  <div className="relative z-10 flex flex-col h-full text-left">
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
                  Dismiss Record
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
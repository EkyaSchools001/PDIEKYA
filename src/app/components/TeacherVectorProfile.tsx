import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import {
    ArrowLeft, ClipboardCheck, Users, FileText, Target,
    TrendingUp, Award, Clock, ChevronRight, UserCheck, Calendar
} from 'lucide-react';

export default function TeacherVectorProfile() {
    const { role, teacherId } = useParams<{ role: string; teacherId: string }>();
    const navigate = useNavigate();
    const {
        getUsers,
        getObservationsByTeacher,
        getGoalsByTeacher,
        getTotalPDHours
    } = useApp();

    const teacher = useMemo(() => {
        return getUsers().find(u => u.empId === teacherId);
    }, [getUsers, teacherId]);

    const observations = useMemo(() => {
        return getObservationsByTeacher(teacherId || '');
    }, [getObservationsByTeacher, teacherId]);

    const goals = useMemo(() => {
        return getGoalsByTeacher(teacherId || '');
    }, [getGoalsByTeacher, teacherId]);

    const pdHours = useMemo(() => {
        return getTotalPDHours(teacherId || '');
    }, [getTotalPDHours, teacherId]);

    const avgScore = useMemo(() => {
        if (observations.length === 0) return '0.0';
        const sum = observations.reduce((acc, obs) => acc + obs.score, 0);
        return (sum / observations.length).toFixed(1);
    }, [observations]);

    if (!teacher) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center space-y-4">
                    <p className="text-slate-400 font-black uppercase tracking-widest">Entity Not Found</p>
                    <Button onClick={() => navigate(`/${role}`)} variant="ghost" className="rounded-full">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Return to Command
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] font-['Geist',sans-serif] pb-20">
            {/* Header / Nav */}
            <header className="bg-white/40 backdrop-blur-md border-b border-black/[0.03] px-12 py-8 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(`/${role}`)}
                            className="h-14 w-14 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 text-slate-400 hover:text-[#A37FBC] transition-all"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="w-6 h-[1.5px] bg-[#A37FBC] rounded-full"></span>
                                <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em]">Growth Telemetry Matrix</p>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Growth Vector: {teacher.name}</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="p-12 max-w-7xl mx-auto w-full space-y-12">
                {/* Profile Overview Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 bg-white/60 backdrop-blur-2xl border-none rounded-[3rem] shadow-sm overflow-hidden p-12">
                        <div className="flex items-center gap-10">
                            <div className="w-32 h-32 rounded-[3rem] bg-[#A37FBC]/10 flex items-center justify-center text-[#A37FBC] font-black text-5xl border border-[#A37FBC]/10 shadow-inner">
                                {teacher.name[0]}
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2">{teacher.name}</h2>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className="text-[10px] font-black text-[#A37FBC] border-[#A37FBC]/20 px-4 py-1 rounded-full uppercase tracking-widest bg-[#A37FBC]/5">
                                            {teacher.designation}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                                            UID: {teacher.empId}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-slate-300" />
                                        <span className="text-xs font-bold uppercase tracking-wide">{teacher.campus}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="h-4 w-4 text-slate-300" />
                                        <span className="text-xs font-bold uppercase tracking-wide">Dept: {teacher.department || 'Academic'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-[#A37FBC] border-none rounded-[3rem] shadow-xl shadow-[#A37FBC]/20 p-12 text-white flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                            <TrendingUp className="w-64 h-64" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-70">Overall Path Progress</p>
                        <div className="text-7xl font-black tracking-tighter mb-4">
                            {Math.round((pdHours / 50) * 100)}%
                        </div>
                        <div className="space-y-4">
                            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full" style={{ width: `${Math.round((pdHours / 50) * 100)}%` }}></div>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 text-center">
                                {pdHours} / 50 PD Credits Earned
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Precision Avg', val: avgScore, sub: '/ 5.0', icon: Target, color: 'text-[#A37FBC]' },
                        { label: 'Telemetry Records', val: observations.length, sub: 'Total', icon: ClipboardCheck, color: 'text-indigo-500' },
                        { label: 'Active Goals', val: goals.filter(g => g.status === 'Active').length, sub: 'In Progress', icon: Award, color: 'text-emerald-500' },
                        { label: 'PD Credits', val: pdHours, sub: 'Hours', icon: TrendingUp, color: 'text-blue-500' }
                    ].map((stat) => (
                        <Card key={stat.label} className="bg-white border-none rounded-[2.5rem] shadow-sm p-8 flex items-center gap-6 group hover:shadow-xl transition-all">
                            <div className={`p-4 rounded-2xl bg-slate-50 group-hover:bg-slate-100 transition-colors ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-slate-900">{stat.val}</span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stat.sub}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                    {/* Left Col: Goals & Progress */}
                    <div className="space-y-12">
                        <section>
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <Award className="h-4 w-4" />
                                    </div>
                                    Professional Objectives
                                </h3>
                            </div>
                            <div className="space-y-6">
                                {goals.length === 0 ? (
                                    <div className="p-16 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-100">
                                        <Award className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active growth vectors assigned</p>
                                    </div>
                                ) : (
                                    goals.map(goal => (
                                        <Card key={goal.id} className="bg-white border-none rounded-[2.5rem] shadow-sm p-10 group hover:shadow-lg transition-all border border-transparent hover:border-emerald-100">
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-emerald-600 transition-colors">{goal.title}</h4>
                                                    <p className="text-xs font-semibold text-slate-500 leading-relaxed mb-4">{goal.description}</p>
                                                    <div className="flex items-center gap-4">
                                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 rounded-full px-4 border-none text-[9px] font-black uppercase tracking-widest">
                                                            {goal.status}
                                                        </Badge>
                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            <Clock className="h-3 w-3" />
                                                            Target: {new Date(goal.target).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Velocity</p>
                                                    <p className="text-3xl font-black text-emerald-500 tracking-tighter">{goal.progress}%</p>
                                                </div>
                                            </div>
                                            <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
                                                    style={{ width: `${goal.progress}%` }}
                                                />
                                            </div>
                                            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Set By: {goal.setBy}</span>
                                                <span className="text-slate-300">Created: {new Date(goal.createdDate).toLocaleDateString()}</span>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Col: Observation Timeline */}
                    <div className="space-y-12">
                        <section>
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                        <ClipboardCheck className="h-4 w-4" />
                                    </div>
                                    Observation Ledger
                                </h3>
                            </div>
                            <div className="space-y-6">
                                {observations.length === 0 ? (
                                    <div className="p-16 text-center bg-white/40 rounded-[3rem] border-2 border-dashed border-slate-100">
                                        <ClipboardCheck className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No administrative records detected</p>
                                    </div>
                                ) : (
                                    observations.slice().reverse().map(obs => (
                                        <Card key={obs.id} className="bg-white border-none rounded-[2.5rem] shadow-sm group hover:shadow-lg transition-all overflow-hidden border border-transparent hover:border-indigo-100">
                                            <div className="p-10">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{obs.domain}</h4>
                                                            <Badge className="bg-slate-100 text-slate-400 rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest border-none">
                                                                {obs.id}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(obs.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                                            <span className="text-slate-200">•</span>
                                                            <span className="flex items-center gap-1.5"><UserCheck className="h-3 w-3" /> {obs.observerName}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Precision</p>
                                                        <p className="text-4xl font-black text-[#A37FBC] tracking-tighter">
                                                            {obs.score}<span className="text-slate-200 text-sm ml-1 select-none">/5.0</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-50 relative group-hover:bg-slate-50 transition-colors">
                                                    <p className="text-sm text-slate-700 leading-relaxed font-semibold italic">"{obs.feedback}"</p>
                                                </div>
                                                {obs.reflection && (
                                                    <div className="mt-4 bg-emerald-50/30 p-6 rounded-3xl border border-emerald-50 flex gap-4">
                                                        <div className="p-2 bg-emerald-100/50 rounded-xl h-fit">
                                                            <MessageSquare className="h-4 w-4 text-emerald-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Teacher Reflection</p>
                                                            <p className="text-sm text-emerald-700 font-semibold leading-relaxed">"{obs.reflection}"</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="mt-8 flex items-center justify-between">
                                                    <div className="flex gap-2">
                                                        {obs.tags.map(tag => (
                                                            <Badge key={tag} className="bg-slate-100 text-slate-400 hover:bg-slate-100 border-none rounded-full px-4 text-[8px] font-black uppercase tracking-widest">
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <Badge className={`rounded-full px-5 py-1 text-[9px] font-black uppercase tracking-widest border-none shadow-sm ${obs.status === 'Reflected' ? 'bg-emerald-500 text-white' :
                                                        obs.status === 'Acknowledged' ? 'bg-blue-500 text-white' :
                                                            'bg-amber-500 text-white'
                                                        }`}>
                                                        {obs.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

const MessageSquare = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);

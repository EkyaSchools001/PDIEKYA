import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, Mail, MapPin, Briefcase, IdCard, Building2, MessageSquare, ClipboardCheck, Clock } from 'lucide-react';
import type { User } from '@/app/data/users';
import { useApp } from '@/app/context/AppContext';
import { formatDistanceToNow } from 'date-fns';

interface ProfileDashboardProps {
    user: User;
    onBack: () => void;
}

export default function ProfileDashboard({ user, onBack }: ProfileDashboardProps) {
    const { getObservationsByObserver } = useApp();

    // Fetch observations performed by this user (if they are an observer)
    const observationsPerformed = getObservationsByObserver(user.empId);
    const reflectionsReceived = observationsPerformed.filter(obs => obs.status === 'Reflected' && obs.reflection);

    // Generate avatar from initials
    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const getAvatarColor = () => {
        // Generate consistent color based on name
        const colors = [
            '#A37FBC', '#3B82F6', '#10B981', '#F59E0B', '#F43F5E',
            '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#06B6D4'
        ];
        const index = user.name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const avatarColor = getAvatarColor();

    return (
        <div className="space-y-8">
            {/* Back Button */}
            <Button
                variant="ghost"
                onClick={onBack}
                className="text-slate-500 hover:text-slate-900 group rounded-full px-6"
            >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Dashboard
            </Button>

            {/* Profile Header Card */}
            <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: avatarColor }}></div>
                <CardContent className="p-12 text-center">
                    {/* Profile Picture */}
                    <div className="flex justify-center mb-8">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={user.name}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                            />
                        ) : (
                            <div
                                className="w-32 h-32 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-4xl font-black"
                                style={{ backgroundColor: avatarColor }}
                            >
                                {getInitials(user.name)}
                            </div>
                        )}
                    </div>

                    {/* User Name */}
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
                        {user.name}
                    </h1>

                    {/* Designation Badge */}
                    <Badge
                        className="text-white border-none rounded-full px-6 py-2 text-xs font-black uppercase tracking-widest shadow-lg mb-6"
                        style={{ backgroundColor: avatarColor }}
                    >
                        {user.designation}
                    </Badge>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <IdCard className="h-5 w-5" style={{ color: avatarColor }} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID</span>
                            </div>
                            <p className="text-lg font-black text-slate-900">{user.empId}</p>
                        </div>

                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <MapPin className="h-5 w-5" style={{ color: avatarColor }} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus</span>
                            </div>
                            <p className="text-lg font-black text-slate-900">{user.campus}</p>
                        </div>

                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <Mail className="h-5 w-5" style={{ color: avatarColor }} />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                            </div>
                            <p className="text-sm font-black text-slate-900 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Observer Specific Stats */}
                    {(user.designation === 'HOS' || user.designation === 'Admin') && observationsPerformed.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-[#A37FBC]/5 p-6 rounded-2xl border border-[#A37FBC]/10">
                                <div className="flex items-center justify-center gap-3 mb-1">
                                    <ClipboardCheck className="h-4 w-4 text-[#A37FBC]" />
                                    <span className="text-[9px] font-black text-[#A37FBC] uppercase tracking-widest">Observations Done</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900">{observationsPerformed.length}</p>
                            </div>
                            <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100/50">
                                <div className="flex items-center justify-center gap-3 mb-1">
                                    <MessageSquare className="h-4 w-4 text-emerald-500" />
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Reflections Received</span>
                                </div>
                                <p className="text-2xl font-black text-slate-900">{reflectionsReceived.length}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>


            {/* Detailed Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Professional Information */}
                <Card className="bg-white/60 backdrop-blur-md border-none rounded-[2.5rem] shadow-sm">
                    <CardHeader className="p-8 border-b border-black/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${avatarColor}20` }}>
                                <Briefcase className="h-5 w-5" style={{ color: avatarColor }} />
                            </div>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                Professional Details
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Designation</p>
                            <p className="text-lg font-black text-slate-900">{user.designation}</p>
                        </div>
                        {user.department && (
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                                <p className="text-lg font-black text-slate-900">{user.department}</p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee ID</p>
                            <p className="text-lg font-black text-slate-900 font-mono">{user.empId}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-white/60 backdrop-blur-md border-none rounded-[2.5rem] shadow-sm">
                    <CardHeader className="p-8 border-b border-black/[0.02]">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${avatarColor}20` }}>
                                <Building2 className="h-5 w-5" style={{ color: avatarColor }} />
                            </div>
                            <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">
                                Campus Information
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus Location</p>
                            <p className="text-lg font-black text-slate-900">{user.campus}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                            <p className="text-sm font-bold text-slate-600 break-all">{user.email}</p>
                        </div>
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mt-6">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">
                                Ekya School PDI System
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Reflections Received Section (For Observers) */}
            {(user.designation === 'HOS' || user.designation === 'Admin') && reflectionsReceived.length > 0 && (
                <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden mt-8">
                    <CardHeader className="p-10 border-b border-black/[0.02]">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Reflections Received</CardTitle>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Feedback introspections from faculty</p>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500 text-white border-none rounded-full px-5 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                {reflectionsReceived.length} Total
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-black/[0.02]">
                            {reflectionsReceived.map((obs) => (
                                <div key={obs.id} className="p-10 hover:bg-slate-50/50 transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm">
                                                {obs.teacherName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 uppercase tracking-tight">{obs.teacherName}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{obs.domain}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">
                                                {formatDistanceToNow(new Date(obs.date), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white/80 p-6 rounded-2xl border border-slate-100/50 group-hover:border-emerald-100 transition-colors">
                                        <p className="text-sm text-slate-600 font-semibold leading-relaxed italic">"{obs.reflection}"</p>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        {obs.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-[8px] font-black uppercase tracking-widest py-0.5 px-3 border-slate-100 text-slate-400">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>

    );
}

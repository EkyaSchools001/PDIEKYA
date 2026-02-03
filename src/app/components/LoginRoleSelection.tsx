import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { GraduationCap, Users, Shield, ArrowLeft } from 'lucide-react';

export default function LoginRoleSelection() {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'teacher',
            title: 'Teacher Central',
            description: 'Access your PD hours, observations, feedback, and goals',
            icon: GraduationCap,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            id: 'school-leader',
            title: 'Leader Hub',
            description: 'Observe teachers, submit feedback, and track progress',
            icon: Users,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            id: 'admin',
            title: 'Admin Gate',
            description: 'Manage users, forms, courses, and generate reports',
            icon: Shield,
            color: 'text-[#A37FBC]',
            bgColor: 'bg-[#A37FBC]/10',
        },
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-['Geist',sans-serif] selection:bg-[#A37FBC]/20 relative overflow-hidden">
            {/* Dynamic Mesh Background */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `var(--mesh-gradient)`,
                        filter: 'blur(80px)',
                        backgroundSize: '100% 100%',
                    }}
                />
            </div>



            <header className="relative w-full py-4 sm:py-6 px-4 sm:px-8 lg:px-12 z-20 border-b border-black/[0.03] bg-[#fafafa] sticky top-0 transition-all">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-6">
                        <img src="/logo.png" alt="Ekya School PDI" className="h-10 w-10 sm:h-16 sm:w-16 object-contain brightness-110" />
                        <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900 uppercase truncate">
                            PORTAL <span className="text-[#A37FBC]">GATEWAYS</span>
                        </h1>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="text-slate-500 hover:text-slate-900 group rounded-full px-3 sm:px-6 h-10 sm:h-12 text-[10px] sm:text-xs font-black uppercase tracking-widest shrink-0"
                    >
                        <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden xs:inline">Back to </span>Home
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-8 relative z-10">
                <div className="max-w-6xl w-full">
                    <div className="text-center mb-10 sm:mb-16 space-y-4 px-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 border border-slate-100 rounded-full backdrop-blur-sm shadow-sm mb-4">
                            <span className="w-2 h-2 bg-[#A37FBC] rounded-full animate-pulse"></span>
                            <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Environment Selection</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            Choose Your <span className="text-[#A37FBC]">Path</span>
                        </h2>
                        <p className="text-slate-500 text-sm sm:text-lg font-medium max-w-2xl mx-auto tracking-tight">
                            Access the specialized hub tailored for your institutional responsibilities.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            return (
                                <div
                                    key={role.id}
                                    className="group relative cursor-pointer"
                                    onClick={() => navigate(`/login/${role.id}`)}
                                >
                                    <Card className="bg-white/50 border-white/50 backdrop-blur-2xl text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(163,127,188,0.12)] transition-all duration-700 group border-none rounded-[2.5rem] overflow-hidden flex flex-col h-full">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#A37FBC]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <CardHeader className="p-6 sm:p-10 relative z-10 flex-1 flex flex-col items-center text-center">
                                            <div className={`${role.bgColor} w-20 h-20 sm:w-28 sm:h-28 rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-700 border border-white/20 mb-6 sm:mb-10`}>
                                                <Icon className={`h-8 w-8 sm:h-12 sm:w-12 ${role.color}`} />
                                            </div>
                                            <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 mb-4 tracking-tighter group-hover:text-[#A37FBC] transition-colors duration-500 uppercase">
                                                {role.title}
                                            </CardTitle>
                                            <CardDescription className="text-slate-500 text-xs sm:text-sm leading-relaxed font-semibold tracking-tight">
                                                {role.description}
                                            </CardDescription>
                                        </CardHeader>
                                        <div className="p-6 sm:p-8 pt-0 relative z-10">
                                            <Button className="w-full bg-white/80 hover:bg-[#A37FBC] text-slate-900 hover:text-white border border-slate-200 group-hover:border-transparent font-black h-12 sm:h-14 rounded-2xl transition-all shadow-sm text-[10px] sm:text-xs uppercase tracking-widest">
                                                Initialize Session
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            <footer className="bg-white/40 backdrop-blur-md border-t border-black/[0.03] py-8 px-8 text-center text-slate-400 text-[10px] z-20 font-bold uppercase tracking-[0.4em]">
                <p>&copy; {new Date().getFullYear()} EKYA SCHOOL PDI <span className="text-[#A37FBC] mx-2">•</span> THE PINNACLE OF PD</p>
            </footer>
        </div>
    );
}

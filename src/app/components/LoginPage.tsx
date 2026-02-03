import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { getUserRole, getUserByEmail } from '@/app/data/users';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, ShieldAlert, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, currentUser } = useApp();
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const userRole = getUserRole(currentUser);
      navigate(`/${userRole}`, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const getRoleTitle = () => {
    switch (role) {
      case 'teacher':
        return 'Teacher';
      case 'school-leader':
        return 'Head of School';
      case 'admin':
        return 'Administrator';
      default:
        return 'User';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = getUserByEmail(email);

    if (!user) {
      setError('Invalid credentials. Please verify your identity.');
      return;
    }

    if (user.password !== password) {
      setError('Invalid credentials. Please verify your identity.');
      return;
    }

    const userActualRole = getUserRole(user);

    if (userActualRole !== role) {
      setError(`Access Denied: unauthorized access for role [${getRoleTitle()}].`);
      return;
    }

    const success = login(email, password);

    if (!success) {
      setError('An unexpected telemetry error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-['Geist',sans-serif] relative overflow-hidden">
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

      <div className="w-full max-w-lg relative z-10">
        <Button
          variant="ghost"
          className="mb-8 text-slate-500 hover:text-slate-900 group rounded-full px-6"
          onClick={() => navigate('/login')}
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Back to Gateways
        </Button>

        <Card className="bg-white/50 border-white/50 backdrop-blur-3xl shadow-[0_20px_50px_rgb(0,0,0,0.05)] border-none rounded-[2.5rem] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#A37FBC]"></div>
          <CardHeader className="p-6 sm:p-10 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
            <div className="flex justify-center">
              <div className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-50">
                <img
                  src="/logo.png"
                  alt="Ekya School PDI"
                  className="h-16 w-16 sm:h-24 sm:w-24 object-contain brightness-110"
                />
              </div>
            </div>
            <div className="text-center space-y-1 sm:space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Portal <span className="text-[#A37FBC]">Access</span>
              </CardTitle>
              <CardDescription className="text-slate-400 font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                Authenticating as {getRoleTitle()}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-10 pt-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#A37FBC] transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@growthub.edu"
                    className="h-14 pl-12 bg-white/50 border-slate-100 text-slate-900 placeholder:text-slate-200 focus:border-[#A37FBC] focus:ring-0 rounded-2xl transition-all font-bold"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Token</Label>
                  <button
                    type="button"
                    className="text-[10px] font-black uppercase tracking-widest text-[#A37FBC] hover:underline"
                    onClick={() => navigate(`/${role}/forgot-password`)}
                  >
                    Reset
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#A37FBC] transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-14 pl-12 bg-white/50 border-slate-100 text-slate-900 placeholder:text-slate-200 focus:border-[#A37FBC] focus:ring-0 rounded-2xl transition-all font-bold"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="bg-rose-50 border-rose-100 text-rose-600 rounded-2xl px-6 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertDescription className="text-xs font-bold uppercase tracking-tight ml-2">{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#A37FBC]/20 transition-all hover:scale-[1.02] active:scale-95 border-none">
                Initialize Session
              </Button>

              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50 text-center space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Environment Telemetry</p>
                <p className="text-[10px] font-mono text-slate-400">
                  UID: <span className="text-slate-600 font-bold">[ANY]@ekyaschool.in</span> | PWD: <span className="text-slate-600 font-bold">PASSWORD</span>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

type Step = 'request-otp' | 'verify-otp' | 'reset-password' | 'success';

export default function ForgotPassword() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('request-otp');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const getRoleTitle = () => {
    switch (role) {
      case 'teacher': return 'Teacher';
      case 'school-leader': return 'Head of School';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier) {
      setError('Please enter your email or contact number.');
      return;
    }

    // Demo logic: Just proceed to next step
    setStep('verify-otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== '123456') {
      setError('Invalid OTP. For demo purposes, use 123456.');
      return;
    }

    setStep('reset-password');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // In a real app, we would call an API here
    setStep('success');
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
          onClick={() => step === 'success' ? navigate(`/login/${role}`) : navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
          {step === 'success' ? 'Back to Login' : 'Back to Gateway'}
        </Button>

        <Card className="bg-white/50 border-white/50 backdrop-blur-3xl shadow-[0_20px_50px_rgb(0,0,0,0.05)] border-none rounded-[2.5rem] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#A37FBC]"></div>
          <CardHeader className="p-6 sm:p-10 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
            <div className="flex justify-center">
              <div className="p-3 sm:p-4 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-50">
                <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-[#A37FBC]" />
              </div>
            </div>
            <div className="text-center space-y-1 sm:space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Identity <span className="text-[#A37FBC]">Recovery</span>
              </CardTitle>
              <CardDescription className="text-slate-400 font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em]">
                {getRoleTitle()} Authorization Bypass
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-10 pt-0">
            {step === 'request-otp' && (
              <form onSubmit={handleRequestOtp} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="identifier" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Vector (Email/Phone)</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="e.g. user@growthub.edu"
                    className="h-14 bg-white/50 border-slate-100 text-slate-900 placeholder:text-slate-200 focus:border-[#A37FBC] focus:ring-0 rounded-2xl transition-all font-bold"
                    value={identifier}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
                    required
                  />
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider ml-1 italic">
                    We'll transmit a 6-digit session key to your registered vector.
                  </p>
                </div>
                {error && (
                  <Alert className="bg-rose-50 border-rose-100 text-rose-600 rounded-2xl px-6 py-4">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription className="text-xs font-bold uppercase tracking-tight ml-2">{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#A37FBC]/20 transition-all border-none">
                  Transmit Key
                </Button>
              </form>
            )}

            {step === 'verify-otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="otp" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Session Authorization Key</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    className="h-14 bg-white/50 border-slate-100 text-slate-900 placeholder:text-slate-200 focus:border-[#A37FBC] focus:ring-0 rounded-2xl transition-all font-black text-center text-xl tracking-[0.5em]"
                    value={otp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                    required
                  />
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                      Target: {identifier}
                    </p>
                    <button
                      type="button"
                      className="text-[9px] font-black uppercase tracking-widest text-[#A37FBC] hover:underline"
                      onClick={() => setStep('request-otp')}
                    >
                      Change Vector
                    </button>
                  </div>
                </div>
                {error && (
                  <Alert className="bg-rose-50 border-rose-100 text-rose-600 rounded-2xl px-6 py-4">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription className="text-xs font-bold uppercase tracking-tight ml-2">{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#A37FBC]/20 transition-all border-none">
                  Validate Key
                </Button>
                <div className="text-center">
                  <button type="button" className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#A37FBC] transition-colors">Retransmit Authorization Key</button>
                </div>
              </form>
            )}

            {step === 'reset-password' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="newPassword" title="New Sequence" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Security Sequence</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-14 bg-white/50 border-slate-100 text-slate-900 placeholder:text-slate-200 focus:border-[#A37FBC] focus:ring-0 rounded-2xl transition-all font-bold"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" title="Confirm Sequence" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Security Sequence</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-14 bg-white/50 border-slate-100 text-slate-900 placeholder:text-slate-200 focus:border-[#A37FBC] focus:ring-0 rounded-2xl transition-all font-bold"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert className="bg-rose-50 border-rose-100 text-rose-600 rounded-2xl px-6 py-4">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription className="text-xs font-bold uppercase tracking-tight ml-2">{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#A37FBC]/20 transition-all border-none">
                  Commit Sequence Update
                </Button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center space-y-8 py-4">
                <div className="flex justify-center">
                  <div className="p-8 bg-emerald-50 rounded-full border border-emerald-100">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Sequence Update Success</h3>
                  <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Your security sequence has been successfully committed to the hub. You may now initialize a new session.
                  </p>
                </div>
                <Button
                  className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 text-sm font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#A37FBC]/20 transition-all border-none"
                  onClick={() => navigate(`/login/${role}`)}
                >
                  Return to Gateway
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

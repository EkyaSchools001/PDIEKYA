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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => step === 'success' ? navigate(`/login/${role}`) : navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {step === 'success' ? 'Back to Login' : 'Back'}
        </Button>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              {getRoleTitle()} Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'request-otp' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">Email or Contact Number</Label>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="e.g. user@ekyaschool.in or 9876543210"
                    value={identifier}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIdentifier(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    We'll send a 6-digit OTP to your registered email or phone.
                  </p>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Send OTP
                </Button>
              </form>
            )}

            {step === 'verify-otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-Digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)}
                    required
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      Sent to: {identifier}
                    </p>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => setStep('request-otp')}
                    >
                      Change
                    </button>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Verify OTP
                </Button>
                <div className="text-center text-xs text-gray-500">
                  Didn't receive code? <button type="button" className="text-blue-600 hover:underline">Resend OTP</button>
                </div>
              </form>
            )}

            {step === 'reset-password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Reset Password
                </Button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center space-y-4 py-4">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Password Reset Successful</h3>
                  <p className="text-sm text-gray-500">
                    Your password has been updated. You can now log in with your new password.
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => navigate(`/login/${role}`)}
                >
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

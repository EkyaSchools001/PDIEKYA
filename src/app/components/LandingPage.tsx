import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/app/context/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { GraduationCap, Bell } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight as IconChevronRightIcon } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { getAnnouncements, getGalleryImages } = useApp();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    contact: ''
  });

  const announcements = getAnnouncements().filter(ann => {
    if (!ann.expiryDate) return true;
    return new Date(ann.expiryDate) > new Date();
  });

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images = getGalleryImages();

  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, images.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Registration submitted for ${registrationForm.name}! An administrator will review your request.`);
    setIsRegisterOpen(false);
    setRegistrationForm({ name: '', email: '', contact: '' });
  };

  const getAnnouncementBadgeColor = (type: string) => {
    switch (type) {
      case 'Urgent': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Academic': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Holiday': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Register': return 'bg-[#A37FBC]/10 text-[#A37FBC] border-[#A37FBC]/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-['Geist',sans-serif] selection:bg-[#A37FBC]/20 relative">
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
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A37FBC]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
      </div>

      {/* Global Header */}
      <header className="relative w-full py-6 px-8 lg:px-12 z-20 border-b border-black/[0.03] bg-white/40 backdrop-blur-md sticky top-0 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#A37FBC] to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
              <img
                src="/logo.png"
                alt="Ekya School PDI"
                className="relative h-20 w-20 object-contain filter drop-shadow-sm brightness-110"
              />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                EKYA <span className="text-[#A37FBC]">SCHOOL</span> PDI
              </h1>
              <p className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase opacity-70 mt-0.5">
                Precision PD Platform
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/login')}
            className="bg-[#A37FBC] text-white hover:bg-[#8e6ba8] font-bold px-8 h-12 rounded-full shadow-lg shadow-[#A37FBC]/20 transition-all hover:scale-105 active:scale-95 border-none"
          >
            Access Portals
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 p-8 lg:p-16 max-w-7xl mx-auto w-full">
        {/* Two-Column Layout Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-start">

          {/* Left Column: Announcements */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-1 px-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#A37FBC] rounded-full"></span>
                <h2 className="text-sm font-black text-[#A37FBC] uppercase tracking-[0.4em]">Bulletins</h2>
              </div>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">Latest Announcements</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {announcements.map((ann) => (
                <Card key={ann.id} className="bg-white/50 border-white/50 backdrop-blur-2xl text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(163,127,188,0.12)] transition-all duration-700 group border-none rounded-[2rem] overflow-hidden flex flex-col h-full">
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                    <IconChevronRight className="h-20 w-20 text-[#A37FBC]" />
                  </div>

                  <CardHeader className="p-8 pb-4 flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <Badge variant="outline" className={`${getAnnouncementBadgeColor(ann.type)} rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-wider border-none shadow-sm`}>
                        {ann.type}
                      </Badge>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(ann.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <CardTitle className="text-2xl font-extrabold text-slate-900 group-hover:text-[#A37FBC] transition-colors duration-500 mb-6 leading-tight">
                      {ann.title}
                    </CardTitle>

                    <CardContent className="p-0">
                      <p className="text-slate-500 leading-relaxed text-sm font-medium tracking-tight">
                        {ann.content}
                      </p>
                    </CardContent>
                  </CardHeader>

                  <div className="p-8 pt-0">
                    {ann.type === 'Register' ? (
                      <Button
                        onClick={() => setIsRegisterOpen(true)}
                        className="w-full bg-white hover:bg-[#A37FBC] text-[#A37FBC] hover:text-white font-black h-14 rounded-2xl uppercase tracking-widest text-[10px] transition-all border border-[#A37FBC]/20 group-hover:border-transparent shadow-sm"
                      >
                        Express Interest
                      </Button>
                    ) : (
                      <div className="h-10 flex items-center text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] pl-2 border-l-2 border-[#A37FBC]/10">
                        Growth Notice
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: High-Fidelity Gallery */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 self-start pt-4 lg:pt-0">
            <div className="space-y-1 px-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#A37FBC] rounded-full"></span>
                <h2 className="text-sm font-black text-[#A37FBC] uppercase tracking-[0.4em]">Life at Ekya</h2>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campus Gallery</h3>
            </div>

            <div className="relative group/slideshow overflow-hidden rounded-[3rem] shadow-2xl bg-slate-900 aspect-[4/5] lg:aspect-[3/4]"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={images[currentSlide].url}
                    alt={images[currentSlide].cap}
                    className="w-full h-full object-cover brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em] mb-3">Campus Moment</p>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-2">
                        {images[currentSlide].cap}
                      </h4>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover/slideshow:opacity-100 transition-opacity duration-300 pointer-events-none">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 pointer-events-auto"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 pointer-events-auto"
                >
                  <IconChevronRightIcon className="h-6 w-6" />
                </Button>
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-8 left-12 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentSlide ? 'w-8 bg-[#A37FBC]' : 'w-2 bg-white/30 hover:bg-white/50'
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Registration Dialog */}
      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-3xl text-slate-900 border-white/40 border rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#A37FBC]"></div>
          <DialogHeader className="px-10 pt-10">
            <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-5">
              <div className="p-4 bg-[#A37FBC]/10 rounded-3xl border border-[#A37FBC]/10">
                <GraduationCap className="h-8 w-8 text-[#A37FBC]" />
              </div>
              Hub Onboarding
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm pt-6 font-semibold leading-relaxed">
              Join the precision professional development network. Please provide your professional credentials.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRegisterSubmit} className="space-y-8 px-10 py-10">
            <div className="space-y-2">
              <Label htmlFor="reg-name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity Name</Label>
              <Input
                id="reg-name"
                placeholder="Dr. Ananya Sharma"
                className="h-14 bg-white/50 border-slate-100 text-slate-900 placeholder:text-slate-300 focus:border-[#A37FBC] focus:ring-0 rounded-2xl transition-all font-bold"
                value={registrationForm.name}
                onChange={e => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Official Address</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="ananya.s@growthub.edu"
                className="h-14 bg-white/50 border-slate-100 text-slate-900 placeholder:text-slate-300 focus:border-[#A37FBC] focus:ring-0 rounded-2xl transition-all font-bold"
                value={registrationForm.email}
                onChange={e => setRegistrationForm({ ...registrationForm, email: e.target.value })}
                required
              />
            </div>
            <DialogFooter className="pt-8">
              <Button type="submit" className="w-full bg-[#A37FBC] hover:bg-[#8e6ba8] h-16 text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#A37FBC]/20 transition-all hover:scale-[1.02] active:scale-95 border-none">
                Onboard Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Mini Footer */}
      <footer className="relative bg-white/40 backdrop-blur-md border-t border-black/[0.03] py-8 px-8 text-center text-slate-400 text-[10px] z-20 font-bold uppercase tracking-[0.4em]">
        <p>&copy; {new Date().getFullYear()} EKYA SCHOOL PDI <span className="text-[#A37FBC] mx-2">•</span> EXCELLENCE THROUGH PRECISION</p>
      </footer>
    </div>
  );
}

function IconChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
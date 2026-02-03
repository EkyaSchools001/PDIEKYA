import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Calendar } from '@/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, CheckCircle2, ClipboardCheck, PlusCircle } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { cn } from '@/app/components/ui/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";

interface MasterObservationFormProps {
    onBack: () => void;
    onSuccess: () => void;
}

const ROLES = [
    'Academic Coordinator',
    'CCA Coordinator',
    'Head of School',
    'ELC Team Member',
    'PDI Team Member',
    'Other'
];

export default function MasterObservationForm({ onBack, onSuccess }: MasterObservationFormProps) {
    const { addObservation, currentUser, getUsers } = useApp();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        teacherId: '',
        teacherName: '',
        teacherEmail: '',
        observerName: currentUser?.name || '',
        observerRole: '',
        otherRole: '',
        date: new Date(),
        domain: '',
        score: '0',
        feedback: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.teacherId) {
            newErrors.teacherId = 'Please select a teacher';
        }
        if (!formData.observerName) {
            newErrors.observerName = 'Observer name is required';
        }
        if (!formData.observerRole) {
            newErrors.observerRole = 'Role is required';
        }
        if (formData.observerRole === 'Other' && !formData.otherRole) {
            newErrors.otherRole = 'Please specify your role';
        }
        if (!formData.date || formData.date > new Date()) {
            newErrors.date = 'Valid date is required (future dates not allowed)';
        }
        if (!formData.domain) {
            newErrors.domain = 'Please select a domain';
        }
        if (!formData.score || isNaN(Number(formData.score)) || Number(formData.score) < 0 || Number(formData.score) > 5) {
            newErrors.score = 'Score must be between 0 and 5';
        }
        if (!formData.feedback || formData.feedback.length < 10) {
            newErrors.feedback = 'Feedback must be at least 10 characters';
        }

        setErrors(newErrors);
        return { isValid: Object.keys(newErrors).length === 0, newErrors };
    };

    const isFormValid =
        formData.teacherId !== '' &&
        formData.observerName !== '' &&
        formData.observerRole !== '' &&
        (formData.observerRole !== 'Other' || formData.otherRole !== '') &&
        formData.date <= new Date() &&
        formData.domain !== '' &&
        formData.score !== '' && !isNaN(Number(formData.score)) &&
        formData.feedback.length >= 10;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid, newErrors } = validate();
        if (isValid) {
            const finalRole = formData.observerRole === 'Other' ? formData.otherRole : formData.observerRole;
            const users = getUsers();

            addObservation({
                teacherId: formData.teacherId,
                teacherName: formData.teacherName,
                observerId: currentUser?.empId || 'UNKNOWN',
                observerName: formData.observerName,
                date: format(formData.date, 'yyyy-MM-dd'),
                domain: formData.domain,
                score: Number(formData.score),
                feedback: formData.feedback,
                tags: ['Master Form', finalRole],
                status: 'Pending',
            });

            setIsSubmitted(true);
        } else {
            // Scroll to first error
            const firstErrorKey = Object.keys(newErrors)[0];
            if (firstErrorKey) {
                const element = document.getElementById(firstErrorKey) || document.getElementsByName(firstErrorKey)[0];
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    element.focus();
                }
            }
        }
    };

    const resetForm = () => {
        setFormData({
            teacherId: '',
            teacherName: '',
            teacherEmail: '',
            observerName: currentUser?.name || '',
            observerRole: '',
            otherRole: '',
            date: new Date(),
            domain: '',
            score: '0',
            feedback: '',
        });
        setErrors({});
        setIsSubmitted(false);
    };

    const allTeachers = getUsers().filter(u => u.designation === 'Teacher');

    const handleTeacherChange = (teacherId: string) => {
        const teacher = allTeachers.find(t => t.empId === teacherId);
        if (teacher) {
            setFormData({
                ...formData,
                teacherId: teacher.empId,
                teacherName: teacher.name,
                teacherEmail: teacher.email
            });
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4">
                <Card className="bg-white border-none rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                    <CardContent className="p-12 text-center space-y-8">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Observation Submitted</h2>
                            <p className="text-slate-500 font-medium tracking-tight">Observation details for {formData.teacherName} have been recorded successfully.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button
                                onClick={onSuccess}
                                className="flex-1 h-16 rounded-2xl bg-[#A37FBC] hover:bg-[#8e6ba8] text-white font-black uppercase text-[10px] tracking-widest transition-all"
                            >
                                Go to Dashboard
                            </Button>
                            <Button
                                variant="outline"
                                onClick={resetForm}
                                className="flex-1 h-16 rounded-2xl border-2 border-slate-100 font-black uppercase text-[10px] tracking-widest transition-all hover:bg-slate-50"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Another
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-20 px-4 space-y-8">
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" onClick={onBack} className="text-slate-500 hover:text-slate-900 group rounded-full px-6">
                    <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Cancel and Return
                </Button>
                <div className="flex items-center gap-2">
                    <span className="w-8 h-1 bg-[#A37FBC] rounded-full"></span>
                    <span className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.3em]">Master Form</span>
                </div>
            </div>

            <header className="space-y-2 mb-12 text-center">
                <h1 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">Master Observation Form</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">Standardized Faculty Assessment Portal</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Teacher Details */}
                <Card className="bg-white border-none rounded-[2.5rem] shadow-sm overflow-hidden hover:shadow-xl hover:shadow-[#A37FBC]/5 transition-all duration-500">
                    <div className="h-2 bg-[#A37FBC] w-full"></div>
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-lg font-black text-slate-900 flex items-center gap-1">
                                    Target Teacher <span className="text-rose-500">*</span>
                                </Label>
                                <Select onValueChange={handleTeacherChange} value={formData.teacherId}>
                                    <SelectTrigger id="teacherId" className={cn(
                                        "h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[#A37FBC] focus:border-[#A37FBC] font-semibold text-slate-700 px-6",
                                        errors.teacherId && "border-rose-300 ring-rose-100"
                                    )}>
                                        <SelectValue placeholder="Identify Teacher Profile" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-xl">
                                        {allTeachers.map((teacher) => (
                                            <SelectItem key={teacher.empId} value={teacher.empId} className="font-bold py-3">
                                                {teacher.name} <span className="text-slate-400 text-[10px] font-black ml-2 opacity-50">[{teacher.empId}]</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teacherId && <p className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-2">{errors.teacherId}</p>}
                            </div>

                            {formData.teacherEmail && (
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in duration-300">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Identity</p>
                                    <p className="text-sm font-bold text-slate-600">{formData.teacherEmail}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Observer Details */}
                <Card className="bg-white border-none rounded-[2.5rem] shadow-sm overflow-hidden hover:shadow-xl hover:shadow-[#A37FBC]/5 transition-all duration-500">
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-lg font-black text-slate-900 flex items-center gap-1">
                                    Observer's Name <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    id="observerName"
                                    placeholder="Enter observer's full name"
                                    value={formData.observerName}
                                    onChange={(e) => setFormData({ ...formData, observerName: e.target.value })}
                                    className={cn(
                                        "h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[#A37FBC] focus:border-[#A37FBC] font-semibold text-slate-700 px-6",
                                        errors.observerName && "border-rose-300 ring-rose-100"
                                    )}
                                />
                                {errors.observerName && <p className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-2">{errors.observerName}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg font-black text-slate-900 flex items-center gap-1">
                                    Observer's Role <span className="text-rose-500">*</span>
                                </Label>
                                <RadioGroup
                                    id="observerRole"
                                    value={formData.observerRole}
                                    onValueChange={(val) => setFormData({ ...formData, observerRole: val })}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {ROLES.map((role) => (
                                        <div key={role} className="flex items-center space-x-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-[#A37FBC]/30 transition-colors">
                                            <RadioGroupItem value={role} id={role} className="text-[#A37FBC] border-[#A37FBC]/20" />
                                            <Label htmlFor={role} className="font-semibold text-slate-700 cursor-pointer flex-1">{role}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>

                                {formData.observerRole === 'Other' && (
                                    <div className="pt-2 animate-in slide-in-from-top-2 duration-300">
                                        <Input
                                            id="otherRole"
                                            placeholder="Specify your role"
                                            value={formData.otherRole}
                                            onChange={(e) => setFormData({ ...formData, otherRole: e.target.value })}
                                            className={cn(
                                                "h-14 bg-white border-slate-200 rounded-2xl focus:ring-[#A37FBC] focus:border-[#A37FBC] font-semibold px-6",
                                                errors.otherRole && "border-rose-300 ring-rose-100"
                                            )}
                                        />
                                        {errors.otherRole && <p className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-2 mt-2">{errors.otherRole}</p>}
                                    </div>
                                )}
                                {errors.observerRole && <p className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-2">{errors.observerRole}</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3: Date */}
                <Card className="bg-white border-none rounded-[2.5rem] shadow-sm overflow-hidden hover:shadow-xl hover:shadow-[#A37FBC]/5 transition-all duration-500">
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-lg font-black text-slate-900 flex items-center gap-1">
                                Date of Observation <span className="text-rose-500">*</span>
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full h-14 justify-start text-left font-semibold rounded-2xl bg-slate-50/50 border-slate-100 px-6 hover:bg-slate-100 transition-colors",
                                            !formData.date && "text-muted-foreground",
                                            errors.date && "border-rose-300"
                                        )}
                                    >
                                        <CalendarIcon className="mr-3 h-4 w-4 text-[#A37FBC]" />
                                        {formData.date ? format(formData.date, "dd-MM-yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-3xl border-none shadow-2xl" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formData.date}
                                        onSelect={(date) => date && setFormData({ ...formData, date })}
                                        disabled={(date) => date > new Date()}
                                        initialFocus
                                        className="p-4"
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date && <p className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-2">{errors.date}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Section 4: Academic Assessment */}
                <Card className="bg-white border-none rounded-[2.5rem] shadow-sm overflow-hidden hover:shadow-xl hover:shadow-[#A37FBC]/5 transition-all duration-500">
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-lg font-black text-slate-900 flex items-center gap-1">
                                Observation Domain <span className="text-rose-500">*</span>
                            </Label>
                            <Select onValueChange={(val) => setFormData({ ...formData, domain: val })} value={formData.domain}>
                                <SelectTrigger id="domain" className={cn(
                                    "h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[#A37FBC] focus:border-[#A37FBC] font-semibold text-slate-700 px-6",
                                    errors.domain && "border-rose-300 ring-rose-100"
                                )}>
                                    <SelectValue placeholder="Identify Assessment Domain" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-xl">
                                    <SelectItem value="Classroom Management" className="font-bold py-3">Classroom Management</SelectItem>
                                    <SelectItem value="Content Delivery" className="font-bold py-3">Content Delivery</SelectItem>
                                    <SelectItem value="Student Assessment" className="font-bold py-3">Student Assessment</SelectItem>
                                    <SelectItem value="Student Engagement" className="font-bold py-3">Student Engagement</SelectItem>
                                    <SelectItem value="Technology Integration" className="font-bold py-3">Technology Integration</SelectItem>
                                    <SelectItem value="Instructional Planning" className="font-bold py-3">Instructional Planning</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.domain && <p className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-2">{errors.domain}</p>}
                        </div>

                        <div className="space-y-4">
                            <Label className="text-lg font-black text-slate-900 flex items-center gap-1">
                                Precision Score (0-5) <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="score"
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                placeholder="E.g. 4.5"
                                value={formData.score}
                                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                                className={cn(
                                    "h-14 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[#A37FBC] focus:border-[#A37FBC] font-semibold text-slate-700 px-6",
                                    errors.score && "border-rose-300 ring-rose-100"
                                )}
                            />
                            {errors.score && <p className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-2">{errors.score}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Section 5: Tactical Feedback */}
                <Card className="bg-white border-none rounded-[2.5rem] shadow-sm overflow-hidden hover:shadow-xl hover:shadow-[#A37FBC]/5 transition-all duration-500">
                    <CardContent className="p-10 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-lg font-black text-slate-900 flex items-center gap-1">
                                Tactical Feedback <span className="text-rose-500">*</span>
                            </Label>
                            <textarea
                                id="feedback"
                                placeholder="Enter detailed pedagogical feedback..."
                                value={formData.feedback}
                                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                                className={cn(
                                    "w-full min-h-[160px] bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-[#A37FBC] focus:border-[#A37FBC] font-semibold text-slate-700 p-6 outline-none transition-all",
                                    errors.feedback && "border-rose-300 ring-rose-100"
                                )}
                            />
                            {errors.feedback && <p className="text-xs font-bold text-rose-500 uppercase tracking-widest pl-2">{errors.feedback}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 pt-8">
                    <Button
                        type="submit"
                        className={cn(
                            "flex-1 h-16 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-300 border-none",
                            "bg-[#A37FBC] hover:bg-[#8e6ba8] text-white shadow-[#A37FBC]/20 hover:scale-[1.02]"
                        )}
                    >
                        Submit Observation
                    </Button>
                    <Button
                        type="button"
                        onClick={resetForm}
                        variant="ghost"
                        className="flex-1 h-16 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all border-2 border-transparent"
                    >
                        Clear Form
                    </Button>
                </div>
            </form>
        </div>
    );
}

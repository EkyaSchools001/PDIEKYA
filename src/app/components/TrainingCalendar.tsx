import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import type { TrainingEvent } from '@/app/data/training';

interface TrainingCalendarProps {
    events: TrainingEvent[];
    onRegister: (event: TrainingEvent) => void;
    getTrainingStatus: (eventId: string) => string | null;
}

export default function TrainingCalendar({ events, onRegister, getTrainingStatus }: TrainingCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedEvent, setSelectedEvent] = useState<TrainingEvent | null>(null);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getEventsForDate = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(event => event.date === dateStr || event.registrationDeadline === dateStr);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`empty-${i}`} className="aspect-square p-2 bg-slate-50/30 rounded-2xl" />
            );
        }

        // Calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDate(day);
            const isCurrentDay = isToday(day);

            days.push(
                <div
                    key={day}
                    className={`aspect-square p-2 rounded-2xl transition-all cursor-pointer group relative ${isCurrentDay
                        ? 'bg-[#A37FBC]/10 border-2 border-[#A37FBC]'
                        : 'bg-white/60 hover:bg-white hover:shadow-lg'
                        }`}
                >
                    <div className="flex flex-col h-full">
                        <span
                            className={`text-xs font-black mb-1 ${isCurrentDay ? 'text-[#A37FBC]' : 'text-slate-600'
                                }`}
                        >
                            {day}
                        </span>
                        <div className="flex-1 space-y-1 overflow-hidden">
                            {dayEvents.slice(0, 3).map((event, idx) => {
                                const isEventDate = event.date === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                                return (
                                    <div
                                        key={`${event.id}-${idx}`}
                                        onClick={() => setSelectedEvent(event)}
                                        className="group/event"
                                    >
                                        <div
                                            className={`text-[8px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded-lg truncate transition-all ${isEventDate ? 'opacity-100' : 'opacity-60'
                                                }`}
                                            style={{
                                                backgroundColor: `${event.color}20`,
                                                color: event.color,
                                                borderLeft: `3px solid ${event.color}`,
                                            }}
                                            title={isEventDate ? event.title : `Deadline: ${event.title}`}
                                        >
                                            {isEventDate ? (
                                                <span className="flex items-center gap-1">
                                                    <CalendarIcon className="h-2 w-2" />
                                                    {event.title.substring(0, 10)}...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-2 w-2" />
                                                    Deadline
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {dayEvents.length > 3 && (
                                <div className="text-[8px] font-black text-slate-400 px-1.5">
                                    +{dayEvents.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <>
            <Card className="bg-white/60 backdrop-blur-3xl border-none rounded-[2.5rem] sm:rounded-[4rem] shadow-sm overflow-hidden flex flex-col h-full border border-black/[0.02]">
                <CardHeader className="p-6 sm:p-12 border-b border-black/[0.02]">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-50 transition-all group-hover:scale-110">
                                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-[#A37FBC]" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </h2>
                                <p className="text-[10px] font-black text-[#A37FBC] uppercase tracking-[0.4em] opacity-70">
                                    Global Academic Ledger
                                </p>
                            </div>
                        </div>
                        <div className="flex bg-white/60 p-2 rounded-2xl border border-slate-100 shadow-sm">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={previousMonth}
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-[#A37FBC] transition-all"
                            >
                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                            <div className="w-[1px] h-6 sm:h-8 bg-slate-100 self-center mx-1"></div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextMonth}
                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl hover:bg-slate-50 text-slate-400 hover:text-[#A37FBC] transition-all"
                            >
                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-x-auto">
                    <div className="min-w-[800px] p-6 sm:p-12">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-6 mb-8">
                            {dayNames.map((day) => (
                                <div
                                    key={day}
                                    className="text-center text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.3em] py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-3 sm:gap-6">
                            {renderCalendarDays()}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 pt-6 border-t border-black/[0.02]">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                Course Categories
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#A37FBC' }} />
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">Technology</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">Pedagogy</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">Assessment</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">Prof. Dev</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F43F5E' }} />
                                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight">Subject Specific</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent className="max-w-2xl w-[95vw] bg-white/95 backdrop-blur-3xl border-none rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl p-6 sm:p-12 overflow-y-auto max-h-[90vh]">
                    {selectedEvent && (
                        <>
                            <div
                                className="absolute top-0 left-0 w-full h-2 rounded-t-[2.5rem] sm:rounded-t-[3rem]"
                                style={{ backgroundColor: selectedEvent.color }}
                            />
                            <DialogHeader className="mb-8">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <DialogTitle className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
                                            {selectedEvent.title}
                                        </DialogTitle>
                                        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: selectedEvent.color }}>
                                            {selectedEvent.topic}
                                        </p>
                                    </div>
                                    <Badge
                                        className="rounded-full px-5 py-1.5 text-[10px] font-black uppercase tracking-widest border-none shadow-sm"
                                        style={{
                                            backgroundColor: selectedEvent.status === 'Completed' ? '#10B981' : selectedEvent.color,
                                            color: 'white',
                                        }}
                                    >
                                        {getTrainingStatus(selectedEvent.id) || selectedEvent.status}
                                    </Badge>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <CalendarIcon className="h-4 w-4" style={{ color: selectedEvent.color }} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Date</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-900">
                                            {new Date(selectedEvent.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </p>
                                        <p className="text-xs font-bold text-slate-500 mt-1">{selectedEvent.time}</p>
                                    </div>

                                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Clock className="h-4 w-4" style={{ color: selectedEvent.color }} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Deadline</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-900">
                                            {new Date(selectedEvent.registrationDeadline).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MapPin className="h-4 w-4" style={{ color: selectedEvent.color }} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campus</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-900">{selectedEvent.campus}</p>
                                    </div>

                                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Users className="h-4 w-4" style={{ color: selectedEvent.color }} />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-900">
                                            {selectedEvent.enrolled} / {selectedEvent.capacity} enrolled
                                        </p>
                                    </div>
                                </div>

                                {selectedEvent.status === 'Open' && !getTrainingStatus(selectedEvent.id) && (
                                    <Button
                                        onClick={() => {
                                            onRegister(selectedEvent);
                                            setSelectedEvent(null);
                                        }}
                                        className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl border-none mt-4"
                                        style={{
                                            backgroundColor: selectedEvent.color,
                                            color: 'white',
                                        }}
                                    >
                                        Initialize Registration
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

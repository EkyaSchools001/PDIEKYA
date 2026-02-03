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

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
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
                                const status = getTrainingStatus(event.id);

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
            <Card className="bg-white/60 backdrop-blur-md border-none rounded-[3rem] shadow-sm overflow-hidden">
                <CardHeader className="p-8 border-b border-black/[0.02]">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </CardTitle>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                Training Schedule Calendar
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={previousMonth}
                                className="h-10 w-10 rounded-xl bg-white/50 hover:bg-white border border-slate-100"
                            >
                                <ChevronLeft className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextMonth}
                                className="h-10 w-10 rounded-xl bg-white/50 hover:bg-white border border-slate-100"
                            >
                                <ChevronRight className="h-4 w-4 text-slate-600" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-2">
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
                </CardContent>
            </Card>

            {/* Event Details Dialog */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-3xl border-none rounded-[3rem] shadow-2xl p-12">
                    {selectedEvent && (
                        <>
                            <div
                                className="absolute top-0 left-0 w-full h-2 rounded-t-[3rem]"
                                style={{ backgroundColor: selectedEvent.color }}
                            />
                            <DialogHeader className="mb-8">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <DialogTitle className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
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
                                <div className="grid grid-cols-2 gap-6">
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
                                        className="w-full h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl border-none"
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

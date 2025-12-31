import { useState, useEffect } from "react";
import {
    HiOutlinePlus,
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineXMark,
} from "react-icons/hi2";
import { calendarAPI, flockAPI } from "../services/api";
import { useToast } from "../components/Toast";
import { LoadingSpinner } from "../components/Loading";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EVENT_TYPES = [
    { value: "vaccination", label: "Vaccination", color: "#f59e0b" },
    { value: "task", label: "Task", color: "#3b82f6" },
    { value: "sale", label: "Sale", color: "#10b981" },
    { value: "reminder", label: "Reminder", color: "#8b5cf6" },
    { value: "meeting", label: "Meeting", color: "#ec4899" },
    { value: "other", label: "Other", color: "#64748b" },
];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [flocks, setFlocks] = useState([]);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        eventType: "reminder",
        startDate: "",
        allDay: true,
        color: "#8b5cf6",
        flock: "",
    });

    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

            const [eventsRes, flocksRes] = await Promise.all([
                calendarAPI.getAllScheduled({
                    start: startOfMonth.toISOString(),
                    end: endOfMonth.toISOString(),
                }),
                flockAPI.getAll(),
            ]);

            setEvents(eventsRes.data || []);
            setFlocks(flocksRes.data || []);
        } catch (error) {
            console.error("Calendar error:", error);
            // Don't show error toast - calendar may just be empty
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await calendarAPI.create(formData);
            addToast("Event created!", "success");
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (error) {
            addToast(error.message || "Failed to create event", "error");
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            eventType: "reminder",
            startDate: "",
            allDay: true,
            color: "#8b5cf6",
            flock: "",
        });
        setSelectedDate(null);
    };

    const openAddModal = (date) => {
        setSelectedDate(date);
        setFormData({
            ...formData,
            startDate: date.toISOString().split("T")[0],
        });
        setShowModal(true);
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const days = [];

        // Previous month's trailing days
        for (let i = 0; i < startingDay; i++) {
            const prevMonthDay = new Date(year, month, -startingDay + i + 1);
            days.push({ date: prevMonthDay, isCurrentMonth: false });
        }

        // Current month's days
        for (let i = 1; i <= totalDays; i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        // Next month's leading days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
        }

        return days;
    };

    const getEventsForDate = (date) => {
        return events.filter((event) => {
            const eventDate = new Date(event.start);
            return (
                eventDate.getFullYear() === date.getFullYear() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getDate() === date.getDate()
            );
        });
    };

    const isToday = (date) => {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    };

    const calendarDays = generateCalendarDays();

    return (
        <section className="space-y-6">
            {/* Header */}
            <header className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
                        Schedule & Events
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
                    <p className="text-sm text-slate-500 mt-1">View vaccinations, tasks, and events</p>
                </div>
                <button
                    onClick={() => openAddModal(new Date())}
                    className="btn-primary flex items-center gap-2"
                >
                    <HiOutlinePlus className="h-5 w-5" />
                    <span>Add Event</span>
                </button>
            </header>

            {/* Calendar Navigation */}
            <div className="card-organic p-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <HiOutlineChevronLeft className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900 min-w-[180px] text-center">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <HiOutlineChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <button
                        onClick={goToToday}
                        className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                        Today
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner size="xl" />
                    </div>
                ) : (
                    <>
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {DAYS.map((day) => (
                                <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => {
                                const dayEvents = getEventsForDate(day.date);
                                const isCurrentMonth = day.isCurrentMonth;
                                const isTodayDate = isToday(day.date);

                                return (
                                    <div
                                        key={index}
                                        onClick={() => openAddModal(day.date)}
                                        className={`min-h-[100px] p-2 rounded-lg border cursor-pointer transition-all hover:shadow-md ${isCurrentMonth
                                                ? "bg-white border-slate-200 hover:border-emerald-300"
                                                : "bg-slate-50 border-slate-100"
                                            } ${isTodayDate ? "ring-2 ring-emerald-500 ring-offset-2" : ""}`}
                                    >
                                        <div
                                            className={`text-sm font-medium mb-1 ${isCurrentMonth ? "text-slate-900" : "text-slate-400"
                                                } ${isTodayDate ? "text-emerald-600" : ""}`}
                                        >
                                            {day.date.getDate()}
                                        </div>
                                        <div className="space-y-1">
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    className="text-xs truncate px-1.5 py-0.5 rounded"
                                                    style={{ backgroundColor: event.color + "20", color: event.color }}
                                                >
                                                    {event.title}
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-xs text-slate-500">
                                                    +{dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Event Legend */}
            <div className="card-organic p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Legend</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm text-slate-600">Vaccinations</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-slate-600">Tasks</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-slate-600">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <span className="text-sm text-slate-600">Urgent</span>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-slate-900">Add Event</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <HiOutlineXMark className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-organic"
                                    required
                                />
                            </div>
                            <div className="grid gap-4 grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="input-organic"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                                    <select
                                        value={formData.eventType}
                                        onChange={(e) => {
                                            const type = EVENT_TYPES.find((t) => t.value === e.target.value);
                                            setFormData({ ...formData, eventType: e.target.value, color: type?.color || "#64748b" });
                                        }}
                                        className="input-organic"
                                    >
                                        {EVENT_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>{t.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Flock (optional)</label>
                                <select
                                    value={formData.flock}
                                    onChange={(e) => setFormData({ ...formData, flock: e.target.value })}
                                    className="input-organic"
                                >
                                    <option value="">None</option>
                                    {flocks.map((f) => (
                                        <option key={f._id} value={f._id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-organic"
                                    rows={2}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost">Cancel</button>
                                <button type="submit" className="btn-primary">Add Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

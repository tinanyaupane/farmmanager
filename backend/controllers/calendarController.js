import CalendarEvent from "../models/CalendarEvent.js";
import VaccinationSchedule from "../models/VaccinationSchedule.js";
import Task from "../models/Task.js";

// @desc    Get calendar events
// @route   GET /api/calendar
export const getEvents = async (req, res) => {
    try {
        const { start, end } = req.query;
        let query = { user: req.user.id };

        if (start && end) {
            query.startDate = { $gte: new Date(start), $lte: new Date(end) };
        }

        const events = await CalendarEvent.find(query)
            .populate("flock", "name")
            .sort({ startDate: 1 });

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all scheduled items for calendar view
// @route   GET /api/calendar/all
export const getAllScheduledItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const { start, end } = req.query;
        const startDate = start ? new Date(start) : new Date();
        const endDate = end ? new Date(end) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        const [vaccinations, tasks, calendarEvents] = await Promise.all([
            // Vaccinations
            VaccinationSchedule.find({
                user: userId,
                scheduledDate: { $gte: startDate, $lte: endDate },
            }).populate("flock", "name"),

            // Tasks
            Task.find({
                user: userId,
                dueDate: { $gte: startDate, $lte: endDate },
            }).populate("assignedTo", "name"),

            // Calendar events
            CalendarEvent.find({
                user: userId,
                startDate: { $gte: startDate, $lte: endDate },
            }).populate("flock", "name"),
        ]);

        // Normalize to calendar format
        const events = [
            ...vaccinations.map((v) => ({
                id: v._id,
                title: `💉 ${v.vaccineName}`,
                start: v.scheduledDate,
                end: v.scheduledDate,
                allDay: true,
                color: v.status === "completed" ? "#10b981" : "#f59e0b",
                type: "vaccination",
                status: v.status,
                flock: v.flock?.name,
            })),
            ...tasks.map((t) => ({
                id: t._id,
                title: `📋 ${t.title}`,
                start: t.dueDate,
                end: t.dueDate,
                allDay: true,
                color: t.status === "completed" ? "#10b981" : t.priority === "urgent" ? "#ef4444" : "#3b82f6",
                type: "task",
                status: t.status,
                priority: t.priority,
                assignedTo: t.assignedTo?.name,
            })),
            ...calendarEvents.map((e) => ({
                id: e._id,
                title: e.title,
                start: e.startDate,
                end: e.endDate || e.startDate,
                allDay: e.allDay,
                color: e.color,
                type: e.eventType,
                flock: e.flock?.name,
            })),
        ];

        res.status(200).json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create calendar event
// @route   POST /api/calendar
export const createEvent = async (req, res) => {
    try {
        const event = await CalendarEvent.create({ ...req.body, user: req.user.id });
        res.status(201).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update calendar event
// @route   PUT /api/calendar/:id
export const updateEvent = async (req, res) => {
    try {
        const event = await CalendarEvent.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete calendar event
// @route   DELETE /api/calendar/:id
export const deleteEvent = async (req, res) => {
    try {
        const event = await CalendarEvent.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

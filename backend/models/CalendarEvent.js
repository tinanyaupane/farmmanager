import mongoose from "mongoose";

const calendarEventSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: [true, "Event title is required"],
        },
        description: String,
        eventType: {
            type: String,
            enum: ["vaccination", "task", "sale", "reminder", "meeting", "other"],
            default: "other",
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: Date,
        allDay: {
            type: Boolean,
            default: true,
        },
        color: {
            type: String,
            default: "#10b981",
        },
        flock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flock",
        },
        relatedModel: {
            type: String,
            enum: ["Flock", "Sale", "Vaccination", "Task", "Health"],
        },
        relatedId: mongoose.Schema.Types.ObjectId,
        isCompleted: {
            type: Boolean,
            default: false,
        },
        reminders: [{
            time: Date,
            sent: { type: Boolean, default: false },
        }],
    },
    {
        timestamps: true,
    }
);

calendarEventSchema.index({ user: 1, startDate: 1 });

const CalendarEvent = mongoose.model("CalendarEvent", calendarEventSchema);
export default CalendarEvent;

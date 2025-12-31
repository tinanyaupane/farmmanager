import mongoose from "mongoose";

const vaccinationScheduleSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        flock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flock",
            required: [true, "Flock is required"],
        },
        vaccineName: {
            type: String,
            required: [true, "Vaccine name is required"],
        },
        scheduledDate: {
            type: Date,
            required: [true, "Scheduled date is required"],
        },
        ageInDays: {
            type: Number,
            required: true,
        },
        administrationRoute: {
            type: String,
            enum: ["drinking_water", "spray", "injection", "eye_drop", "wing_web"],
            default: "drinking_water",
        },
        dosage: String,
        status: {
            type: String,
            enum: ["scheduled", "completed", "missed", "postponed"],
            default: "scheduled",
        },
        completedDate: Date,
        completedBy: String,
        batchNumber: String,
        manufacturer: String,
        cost: {
            type: Number,
            default: 0,
        },
        notes: String,
        reminderSent: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

vaccinationScheduleSchema.index({ user: 1, scheduledDate: 1 });
vaccinationScheduleSchema.index({ user: 1, status: 1 });

const VaccinationSchedule = mongoose.model("VaccinationSchedule", vaccinationScheduleSchema);
export default VaccinationSchedule;

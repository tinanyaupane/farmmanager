import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getEvents,
    getAllScheduledItems,
    createEvent,
    updateEvent,
    deleteEvent,
} from "../controllers/calendarController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getEvents).post(createEvent);
router.get("/all", getAllScheduledItems);
router.route("/:id").put(updateEvent).delete(deleteEvent);

export default router;

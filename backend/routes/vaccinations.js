import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getVaccinations,
    getVaccinationStats,
    getUpcomingVaccinations,
    createVaccination,
    updateVaccination,
    completeVaccination,
    deleteVaccination,
} from "../controllers/vaccinationController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getVaccinations).post(createVaccination);
router.get("/stats", getVaccinationStats);
router.get("/upcoming", getUpcomingVaccinations);
router.route("/:id").put(updateVaccination).delete(deleteVaccination);
router.put("/:id/complete", completeVaccination);

export default router;

import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getCustomers,
    getCustomerStats,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from "../controllers/customerController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCustomers).post(createCustomer);
router.get("/stats", getCustomerStats);
router.route("/:id").get(getCustomer).put(updateCustomer).delete(deleteCustomer);

export default router;

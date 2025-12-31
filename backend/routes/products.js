import express from "express";
import { protect } from "../middleware/auth.js";
import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    updatePrice,
    deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getProducts).post(createProduct);
router.route("/:id").get(getProduct).put(updateProduct).delete(deleteProduct);
router.put("/:id/price", updatePrice);

export default router;

import Product from "../models/Product.js";

// @desc    Get all products
// @route   GET /api/products
export const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = { user: req.user.id, isActive: true };
        if (category && category !== "all") query.category = category;

        const products = await Product.find(query).sort({ name: 1 });
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create product
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try {
        const productData = {
            ...req.body,
            user: req.user.id,
            priceHistory: [{ price: req.body.basePrice, date: new Date(), reason: "Initial price" }],
        };
        const product = await Product.create(productData);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update product price
// @route   PUT /api/products/:id/price
export const updatePrice = async (req, res) => {
    try {
        const { basePrice, wholesalePrice, retailPrice, reason } = req.body;

        const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Add to price history
        product.priceHistory.push({
            price: basePrice,
            date: new Date(),
            reason: reason || "Price update",
        });

        product.basePrice = basePrice;
        if (wholesalePrice) product.wholesalePrice = wholesalePrice;
        if (retailPrice) product.retailPrice = retailPrice;

        await product.save();
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

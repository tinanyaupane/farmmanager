import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";

// @desc    Get all customers
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({ user: req.user.id }).sort({ name: 1 });
        res.status(200).json({ success: true, count: customers.length, data: customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get customer stats
// @route   GET /api/customers/stats
export const getCustomerStats = async (req, res) => {
    try {
        const [totalCustomers, activeCustomers, totalCredit] = await Promise.all([
            Customer.countDocuments({ user: req.user.id }),
            Customer.countDocuments({ user: req.user.id, isActive: true }),
            Customer.aggregate([
                { $match: { user: req.user._id } },
                { $group: { _id: null, total: { $sum: "$currentCredit" } } },
            ]),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalCustomers,
                activeCustomers,
                totalCredit: totalCredit[0]?.total || 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single customer with purchase history
// @route   GET /api/customers/:id
export const getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id, user: req.user.id });
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // Get purchase history
        const purchases = await Sale.find({
            user: req.user.id,
            customer: customer.name
        }).sort({ saleDate: -1 }).limit(20);

        res.status(200).json({
            success: true,
            data: { ...customer.toObject(), purchases }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create customer
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create({ ...req.body, user: req.user.id });
        res.status(201).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, data: customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
export const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

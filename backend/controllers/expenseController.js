import Expense from "../models/Expense.js";

// @desc    Get all expenses
// @route   GET /api/expenses
export const getExpenses = async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;
        let query = { user: req.user.id };

        if (startDate && endDate) {
            query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (category && category !== "all") {
            query.category = category;
        }

        const expenses = await Expense.find(query)
            .populate("flock", "name")
            .sort({ date: -1 });

        res.status(200).json({ success: true, count: expenses.length, data: expenses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get expense stats
// @route   GET /api/expenses/stats
export const getExpenseStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfYear = new Date(today.getFullYear(), 0, 1);

        const [totalThisMonth, totalThisYear, byCategory] = await Promise.all([
            Expense.aggregate([
                { $match: { user: req.user._id, date: { $gte: startOfMonth } } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Expense.aggregate([
                { $match: { user: req.user._id, date: { $gte: startOfYear } } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]),
            Expense.aggregate([
                { $match: { user: req.user._id, date: { $gte: startOfMonth } } },
                { $group: { _id: "$category", total: { $sum: "$amount" } } },
            ]),
        ]);

        res.status(200).json({
            success: true,
            data: {
                thisMonth: totalThisMonth[0]?.total || 0,
                thisYear: totalThisYear[0]?.total || 0,
                byCategory: byCategory.reduce((acc, item) => {
                    acc[item._id] = item.total;
                    return acc;
                }, {}),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create expense
// @route   POST /api/expenses
export const createExpense = async (req, res) => {
    try {
        const expense = await Expense.create({ ...req.body, user: req.user.id });
        res.status(201).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }
        res.status(200).json({ success: true, data: expense });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
export const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!expense) {
            return res.status(404).json({ success: false, message: "Expense not found" });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

import Sale from "../models/Sale.js";

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
export const getSales = async (req, res, next) => {
    try {
        const { startDate, endDate, status, customer } = req.query;

        let query = { user: req.user.id };

        if (startDate && endDate) {
            query.saleDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        if (status) {
            query.paymentStatus = status;
        }

        if (customer) {
            query.customer = new RegExp(customer, "i");
        }

        const sales = await Sale.find(query).sort("-saleDate");

        res.status(200).json({
            success: true,
            count: sales.length,
            data: sales,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single sale
// @route   GET /api/sales/:id
// @access  Private
export const getSale = async (req, res, next) => {
    try {
        const sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: "Sale not found",
            });
        }

        if (sale.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        res.status(200).json({
            success: true,
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
export const createSale = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        // Generate invoice number
        const count = await Sale.countDocuments({ user: req.user.id });
        req.body.invoiceNumber = `INV-${Date.now()}-${count + 1}`;

        const sale = await Sale.create(req.body);

        res.status(201).json({
            success: true,
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update sale
// @route   PUT /api/sales/:id
// @access  Private
export const updateSale = async (req, res, next) => {
    try {
        let sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: "Sale not found",
            });
        }

        if (sale.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: sale,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete sale
// @route   DELETE /api/sales/:id
// @access  Private
export const deleteSale = async (req, res, next) => {
    try {
        const sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({
                success: false,
                message: "Sale not found",
            });
        }

        if (sale.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        await sale.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get sales statistics
// @route   GET /api/sales/stats
// @access  Private
export const getSalesStats = async (req, res, next) => {
    try {
        const sales = await Sale.find({ user: req.user.id });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaySales = sales.filter(
            (sale) => new Date(sale.saleDate) >= today
        );

        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthSales = sales.filter(
            (sale) => new Date(sale.saleDate) >= thisMonth
        );

        const stats = {
            totalSales: sales.length,
            totalRevenue: sales.reduce((acc, sale) => acc + sale.totalAmount, 0),
            todaySales: todaySales.reduce((acc, sale) => acc + sale.totalAmount, 0),
            monthlyRevenue: monthSales.reduce((acc, sale) => acc + sale.totalAmount, 0),
            pendingPayments: sales.filter((s) => s.paymentStatus === "pending").length,
        };

        res.status(200).json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
};

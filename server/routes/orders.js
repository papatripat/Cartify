const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders — create order
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, totalPrice, stripePaymentIntentId } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalPrice,
            stripePaymentIntentId,
            paymentStatus: 'paid'
        });

        // Update stock for each item
        const io = req.app.get('io');
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
                await product.save();
                if (io) io.emit('inventory-update', { product, action: 'stock-changed' });
            }
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/orders — admin: all orders, user: own orders
router.get('/', protect, async (req, res) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        } else {
            orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/orders/stats — admin stats
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalProducts = await Product.countDocuments();
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });
        const recentOrders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalProducts,
            lowStockProducts,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/orders/:id — update order status (admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: req.body.orderStatus },
            { new: true }
        ).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

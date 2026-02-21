const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products — list all products with optional filters
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, featured } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (featured === 'true') {
            query.featured = true;
        }

        let sortObj = { createdAt: -1 };
        if (sort === 'price_asc') sortObj = { price: 1 };
        if (sort === 'price_desc') sortObj = { price: -1 };
        if (sort === 'name') sortObj = { name: 1 };
        if (sort === 'rating') sortObj = { rating: -1 };

        const products = await Product.find(query).sort(sortObj);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/products — admin only
router.post('/', protect, admin, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        // Emit inventory update
        const io = req.app.get('io');
        if (io) io.emit('inventory-update', { product, action: 'created' });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/products/:id — admin only
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Emit inventory update
        const io = req.app.get('io');
        if (io) io.emit('inventory-update', { product, action: 'updated' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const io = req.app.get('io');
        if (io) io.emit('inventory-update', { product, action: 'deleted' });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

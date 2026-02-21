require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const products = [
    {
        name: 'Wireless Noise-Canceling Headphones',
        description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and Hi-Res Audio support. Features adaptive sound control and speak-to-chat technology.',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: 'Electronics',
        stock: 45,
        sku: 'ELEC-HP-001',
        featured: true,
        rating: 4.8,
        numReviews: 234
    },
    {
        name: 'Smart Watch Pro',
        description: 'Advanced smartwatch with health monitoring, GPS tracking, and 5-day battery life. Water resistant to 50m with always-on AMOLED display.',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        category: 'Electronics',
        stock: 32,
        sku: 'ELEC-SW-002',
        featured: true,
        rating: 4.6,
        numReviews: 189
    },
    {
        name: 'Ultra-Slim Laptop Stand',
        description: 'Ergonomic aluminum laptop stand with adjustable height. Compatible with all laptops 10-17 inches. Foldable design for portability.',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        category: 'Accessories',
        stock: 78,
        sku: 'ACC-LS-003',
        featured: false,
        rating: 4.4,
        numReviews: 156
    },
    {
        name: 'Premium Leather Backpack',
        description: 'Handcrafted genuine leather backpack with laptop compartment, anti-theft design, and waterproof coating. Perfect for daily commute.',
        price: 189.99,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        category: 'Accessories',
        stock: 23,
        sku: 'ACC-BP-004',
        featured: true,
        rating: 4.7,
        numReviews: 98
    },
    {
        name: 'Minimalist Running Shoes',
        description: 'Lightweight running shoes with responsive cushioning and breathable knit upper. Designed for neutral runners seeking speed.',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        category: 'Sports',
        stock: 56,
        sku: 'SPT-RS-005',
        featured: true,
        rating: 4.5,
        numReviews: 312
    },
    {
        name: 'Organic Cotton T-Shirt',
        description: 'Premium organic cotton t-shirt with a relaxed fit. Sustainably sourced and ethically manufactured. Available in multiple colors.',
        price: 34.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        category: 'Clothing',
        stock: 120,
        sku: 'CLO-TS-006',
        featured: false,
        rating: 4.3,
        numReviews: 87
    },
    {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB mechanical keyboard with hot-swappable switches, PBT keycaps, and programmable macros. N-key rollover with dedicated media controls.',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500',
        category: 'Electronics',
        stock: 3,
        sku: 'ELEC-KB-007',
        featured: false,
        rating: 4.9,
        numReviews: 445
    },
    {
        name: 'Yoga Mat Premium',
        description: 'Extra-thick 6mm yoga mat with alignment lines. Non-slip surface on both sides. Includes carrying strap. Eco-friendly TPE material.',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        category: 'Sports',
        stock: 68,
        sku: 'SPT-YM-008',
        featured: false,
        rating: 4.6,
        numReviews: 203
    },
    {
        name: 'Ceramic Pour-Over Coffee Set',
        description: 'Japanese-inspired ceramic pour-over coffee dripper set with server. Includes reusable stainless steel filter. Makes 1-4 cups.',
        price: 74.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
        category: 'Home & Living',
        stock: 41,
        sku: 'HOM-CF-009',
        featured: true,
        rating: 4.7,
        numReviews: 167
    },
    {
        name: 'Denim Jacket Classic',
        description: 'Classic fit denim jacket with vintage wash. Features brass buttons, adjustable waist tabs, and chest pockets. 100% premium cotton denim.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
        category: 'Clothing',
        stock: 34,
        sku: 'CLO-DJ-010',
        featured: false,
        rating: 4.4,
        numReviews: 76
    },
    {
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad with LED indicator. Supports Qi-enabled devices. Ultra-slim design with anti-slip surface.',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=500',
        category: 'Electronics',
        stock: 2,
        sku: 'ELEC-WC-011',
        featured: false,
        rating: 4.2,
        numReviews: 134
    },
    {
        name: 'Scented Soy Candle Set',
        description: 'Set of 3 hand-poured soy candles in calming scents: Lavender, Vanilla, and Sandalwood. 40-hour burn time each. Reusable glass jars.',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=500',
        category: 'Home & Living',
        stock: 55,
        sku: 'HOM-SC-012',
        featured: false,
        rating: 4.8,
        numReviews: 211
    }
];

const seedDB = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});

        // Create admin user
        await User.create({
            name: 'Admin',
            email: 'admin@cartify.com',
            password: 'admin123',
            role: 'admin'
        });

        // Create demo user
        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'user123',
            role: 'user'
        });

        // Create products
        await Product.insertMany(products);

        console.log('✅ Database seeded successfully!');
        console.log('📧 Admin: admin@cartify.com / admin123');
        console.log('📧 User: john@example.com / user123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        process.exit(1);
    }
};

seedDB();

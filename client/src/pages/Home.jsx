import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Zap, Shield, Truck } from 'lucide-react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

export default function Home() {
    const [featured, setFeatured] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios.get('/api/products?featured=true')
            .then(res => { setFeatured(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const features = [
        { icon: <Zap size={24} />, title: 'Lightning Fast', desc: 'Optimized for speed with real-time updates' },
        { icon: <Shield size={24} />, title: 'Secure Payments', desc: 'Powered by Stripe for maximum security' },
        { icon: <Truck size={24} />, title: 'Fast Delivery', desc: 'Track your orders in real-time' },
    ]

    return (
        <div className="page">
            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badge">
                            <Sparkles size={16} />
                            Premium E-Commerce Experience
                        </div>
                        <h1 className="hero-title">
                            Discover Products <br />That <span>Inspire</span> You
                        </h1>
                        <p className="hero-subtitle">
                            Shop the latest trends with secure payments, real-time inventory tracking,
                            and a seamless shopping experience. Built with modern technology for the modern shopper.
                        </p>
                        <div className="hero-actions">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Shop Now <ArrowRight size={18} />
                            </Link>
                            <Link to="/register" className="btn btn-secondary btn-lg">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-xl)' }}>
                        {features.map((f, i) => (
                            <div key={i} className="glass-card" style={{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', cursor: 'default' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'rgba(108, 92, 231, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {f.icon}
                                </div>
                                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{f.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Products</h2>
                            <p className="section-subtitle">Curated collection of our best sellers</p>
                        </div>
                        <Link to="/products" className="btn btn-secondary">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>
                    {loading ? (
                        <div className="products-grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="card" style={{ minHeight: 380 }}>
                                    <div className="skeleton" style={{ height: 250 }} />
                                    <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                        <div className="skeleton" style={{ height: 12, width: 80 }} />
                                        <div className="skeleton" style={{ height: 20, width: '80%' }} />
                                        <div className="skeleton" style={{ height: 16, width: 60 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featured.slice(0, 4).map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="section" style={{ textAlign: 'center', padding: 'var(--space-3xl) 0' }}>
                <div className="container">
                    <div className="glass-card" style={{
                        padding: 'var(--space-3xl)',
                        background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.06), rgba(0, 184, 148, 0.06))',
                        borderColor: 'rgba(108, 92, 231, 0.15)'
                    }}>
                        <h2 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, marginBottom: 'var(--space-md)' }}>
                            Ready to Start Shopping?
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: 500, margin: '0 auto var(--space-xl)' }}>
                            Join thousands of happy customers and experience premium shopping with real-time tracking.
                        </p>
                        <Link to="/products" className="btn btn-accent btn-lg">
                            Explore Products <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-inner">
                        <span className="navbar-logo" style={{ fontSize: 'var(--font-size-xl)' }}>Cartify</span>
                        <span className="footer-text">© 2026 Cartify. Built for portfolio demonstration.</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}

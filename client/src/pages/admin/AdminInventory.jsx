import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, BarChart3, AlertTriangle, RefreshCw } from 'lucide-react'
import axios from 'axios'
import { useSocket } from '../../context/SocketContext'

export default function AdminInventory() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState(null)
    const location = useLocation()
    const { socket, connected } = useSocket()

    const adminNav = [
        { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <Package size={18} />, label: 'Products' },
        { path: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
        { path: '/admin/inventory', icon: <BarChart3 size={18} />, label: 'Inventory' },
    ]

    const fetchProducts = () => {
        axios.get('/api/products')
            .then(res => { setProducts(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { fetchProducts() }, [])

    // Real-time inventory updates
    useEffect(() => {
        if (!socket) return
        const handler = ({ product, action }) => {
            setLastUpdate({ product: product.name, action, time: new Date() })
            if (action === 'deleted') {
                setProducts(prev => prev.filter(p => p._id !== product._id))
            } else {
                setProducts(prev => {
                    const exists = prev.find(p => p._id === product._id)
                    if (exists) return prev.map(p => p._id === product._id ? product : p)
                    return [product, ...prev]
                })
            }
        }
        socket.on('inventory-update', handler)
        return () => socket.off('inventory-update', handler)
    }, [socket])

    const lowStock = products.filter(p => p.stock <= 5)
    const outOfStock = products.filter(p => p.stock === 0)
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

    const getStockBar = (stock) => {
        const max = 120
        const pct = Math.min(100, (stock / max) * 100)
        const color = stock === 0 ? 'var(--error)' : stock <= 5 ? 'var(--warning)' : stock <= 20 ? 'var(--accent)' : 'var(--success)'
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', width: '100%' }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: color, transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color, minWidth: 32, textAlign: 'right' }}>
                    {stock}
                </span>
            </div>
        )
    }

    return (
        <div className="page">
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <h4 className="admin-sidebar-title">Admin Panel</h4>
                    <nav className="admin-nav">
                        {adminNav.map(item => (
                            <Link key={item.path} to={item.path}
                                className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}>
                                {item.icon} {item.label}
                            </Link>
                        ))}
                    </nav>
                </aside>
                <main className="admin-content">
                    <div className="admin-header">
                        <div>
                            <h1 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                Real-Time Inventory
                                <span className="live-dot" />
                            </h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginTop: 4 }}>
                                {connected ? 'Live updates enabled' : 'Reconnecting...'}
                            </p>
                        </div>
                        <button className="btn btn-secondary" onClick={fetchProducts}>
                            <RefreshCw size={16} /> Refresh
                        </button>
                    </div>

                    {/* Summary Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
                        <div className="stat-card">
                            <span className="stat-card-label">Total Stock Units</span>
                            <span className="stat-card-value">{totalStock}</span>
                        </div>
                        <div className="stat-card" style={{ borderColor: lowStock.length > 0 ? 'rgba(253, 203, 110, 0.3)' : 'var(--border)' }}>
                            <span className="stat-card-label">Low Stock Items</span>
                            <span className="stat-card-value" style={{ color: lowStock.length > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
                                {lowStock.length}
                            </span>
                        </div>
                        <div className="stat-card" style={{ borderColor: outOfStock.length > 0 ? 'rgba(225, 112, 85, 0.3)' : 'var(--border)' }}>
                            <span className="stat-card-label">Out of Stock</span>
                            <span className="stat-card-value" style={{ color: outOfStock.length > 0 ? 'var(--error)' : 'var(--text-primary)' }}>
                                {outOfStock.length}
                            </span>
                        </div>
                    </div>

                    {/* Last Update Banner */}
                    {lastUpdate && (
                        <div style={{
                            padding: 'var(--space-md) var(--space-lg)',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(0, 206, 201, 0.1)',
                            border: '1px solid rgba(0, 206, 201, 0.2)',
                            marginBottom: 'var(--space-lg)',
                            fontSize: 'var(--font-size-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-sm)',
                            animation: 'fadeInUp 0.3s ease'
                        }}>
                            <span className="live-dot" />
                            <strong>{lastUpdate.product}</strong> — {lastUpdate.action} at {lastUpdate.time.toLocaleTimeString()}
                        </div>
                    )}

                    {/* Low Stock Alerts */}
                    {lowStock.length > 0 && (
                        <div style={{ marginBottom: 'var(--space-xl)' }}>
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                <AlertTriangle size={18} /> Low Stock Alerts
                            </h3>
                            <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                                {lowStock.map(p => (
                                    <div key={p._id} style={{
                                        padding: 'var(--space-md) var(--space-lg)',
                                        borderRadius: 'var(--radius-md)',
                                        background: p.stock === 0 ? 'rgba(225, 112, 85, 0.08)' : 'rgba(253, 203, 110, 0.08)',
                                        border: `1px solid ${p.stock === 0 ? 'rgba(225, 112, 85, 0.2)' : 'rgba(253, 203, 110, 0.2)'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                            <img src={p.image} alt="" style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                                        </div>
                                        <span style={{
                                            fontWeight: 700,
                                            color: p.stock === 0 ? 'var(--error)' : 'var(--warning)'
                                        }}>
                                            {p.stock === 0 ? 'OUT OF STOCK' : `${p.stock} remaining`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Inventory Table */}
                    {loading ? (
                        <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>SKU</th>
                                    <th>Category</th>
                                    <th style={{ width: '30%' }}>Stock Level</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                                <img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                                <span style={{ fontWeight: 600 }}>{p.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{p.sku}</td>
                                        <td>{p.category}</td>
                                        <td>{getStockBar(p.stock)}</td>
                                        <td>
                                            <span className={`status-badge ${p.stock === 0 ? 'status-failed' : p.stock <= 5 ? 'status-pending' : 'status-paid'}`}>
                                                {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
        </div>
    )
}

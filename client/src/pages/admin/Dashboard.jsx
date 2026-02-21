import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, BarChart3, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'
import api from '../../api'
import { useSocket } from '../../context/SocketContext'

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const { connected } = useSocket()

    useEffect(() => {
        api.get('/api/orders/stats')
            .then(res => { setStats(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const adminNav = [
        { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <Package size={18} />, label: 'Products' },
        { path: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
        { path: '/admin/inventory', icon: <BarChart3 size={18} />, label: 'Inventory' },
    ]

    return (
        <div className="page">
            <div className="admin-layout">
                <aside className="admin-sidebar">
                    <h4 className="admin-sidebar-title">Admin Panel</h4>
                    <nav className="admin-nav">
                        {adminNav.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div style={{ marginTop: 'var(--space-2xl)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: 'var(--font-size-sm)' }}>
                            <span className="live-dot" style={{ background: connected ? 'var(--success)' : 'var(--error)' }} />
                            <span style={{ color: 'var(--text-secondary)' }}>
                                {connected ? 'Real-time Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>
                </aside>

                <main className="admin-content">
                    <div className="admin-header">
                        <h1>Dashboard Overview</h1>
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                            Welcome back, Admin
                        </span>
                    </div>

                    {loading ? (
                        <div className="stats-grid">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-lg)' }} />
                            ))}
                        </div>
                    ) : stats && (
                        <>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-card-icon purple"><DollarSign size={24} /></div>
                                    <span className="stat-card-label">Total Revenue</span>
                                    <span className="stat-card-value">${stats.totalRevenue.toFixed(0)}</span>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-icon green"><ShoppingBag size={24} /></div>
                                    <span className="stat-card-label">Total Orders</span>
                                    <span className="stat-card-value">{stats.totalOrders}</span>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-icon blue"><Package size={24} /></div>
                                    <span className="stat-card-label">Total Products</span>
                                    <span className="stat-card-value">{stats.totalProducts}</span>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-card-icon orange"><AlertTriangle size={24} /></div>
                                    <span className="stat-card-label">Low Stock Alerts</span>
                                    <span className="stat-card-value">{stats.lowStockProducts}</span>
                                </div>
                            </div>

                            {/* Recent orders */}
                            <div style={{ marginTop: 'var(--space-xl)' }}>
                                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
                                    <TrendingUp size={20} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
                                    Recent Orders
                                </h2>
                                {stats.recentOrders.length === 0 ? (
                                    <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>
                                ) : (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Customer</th>
                                                <th>Total</th>
                                                <th>Payment</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentOrders.map(order => (
                                                <tr key={order._id}>
                                                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>
                                                        {order._id.slice(-8).toUpperCase()}
                                                    </td>
                                                    <td>{order.user?.name || 'Unknown'}</td>
                                                    <td style={{ fontWeight: 700 }}>${order.totalPrice.toFixed(2)}</td>
                                                    <td>
                                                        <span className={`status-badge status-${order.paymentStatus}`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`status-badge status-${order.orderStatus}`}>
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td style={{ color: 'var(--text-muted)' }}>
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}

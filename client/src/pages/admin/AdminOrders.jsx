import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, BarChart3 } from 'lucide-react'
import api from '../../api'

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const location = useLocation()

    const adminNav = [
        { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <Package size={18} />, label: 'Products' },
        { path: '/admin/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
        { path: '/admin/inventory', icon: <BarChart3 size={18} />, label: 'Inventory' },
    ]

    const fetchOrders = () => {
        api.get('/api/orders')
            .then(res => { setOrders(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => { fetchOrders() }, [])

    const updateStatus = async (id, orderStatus) => {
        try {
            await api.put(`/api/orders/${id}`, { orderStatus })
            fetchOrders()
        } catch (err) {
            alert('Error updating order')
        }
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
                        <h1>Orders Management</h1>
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                            {orders.length} total orders
                        </span>
                    </div>

                    {loading ? (
                        <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <ShoppingBag size={48} />
                            <h3 style={{ marginTop: 'var(--space-md)' }}>No orders yet</h3>
                            <p>Orders will appear here after customers purchase products</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{order.user?.name || 'Unknown'}</div>
                                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                                    {order.user?.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{order.items.length} item{order.items.length > 1 ? 's' : ''}</td>
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
                                        <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td>
                                            <select
                                                className="form-select"
                                                value={order.orderStatus}
                                                onChange={e => updateStatus(order._id, e.target.value)}
                                                style={{ padding: 'var(--space-xs) var(--space-sm)', fontSize: 'var(--font-size-xs)', minWidth: 120 }}
                                            >
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
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

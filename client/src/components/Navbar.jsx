import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function Navbar() {
    const { user, logout } = useAuth()
    const { totalItems, toast } = useCart()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

    const isActive = (path) => location.pathname === path ? 'active' : ''

    return (
        <>
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link to="/" className="navbar-logo">Cartify</Link>

                    <ul className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
                        <li><Link to="/" className={isActive('/')} onClick={() => setMobileOpen(false)}>Home</Link></li>
                        <li><Link to="/products" className={isActive('/products')} onClick={() => setMobileOpen(false)}>Products</Link></li>
                        {user && user.role === 'admin' && (
                            <li><Link to="/admin" className={isActive('/admin')} onClick={() => setMobileOpen(false)}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <LayoutDashboard size={14} /> Admin
                                </span>
                            </Link></li>
                        )}
                    </ul>

                    <div className="navbar-actions">
                        <Link to="/cart" className="navbar-cart">
                            <ShoppingCart size={18} />
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{user.name}</span>
                                <button onClick={logout} className="btn btn-ghost btn-sm">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-sm">
                                <User size={14} /> Sign In
                            </Link>
                        )}

                        <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>
            </nav>

            {toast && <div className="toast">{toast}</div>}
        </>
    )
}

import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, BarChart3, Plus, Pencil, Trash2, X } from 'lucide-react'
import axios from 'axios'

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({
        name: '', description: '', price: '', image: '', category: 'Electronics', stock: '', sku: '', featured: false
    })
    const location = useLocation()

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

    const openCreate = () => {
        setEditing(null)
        setForm({ name: '', description: '', price: '', image: '', category: 'Electronics', stock: '', sku: '', featured: false })
        setShowModal(true)
    }

    const openEdit = (product) => {
        setEditing(product._id)
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            sku: product.sku,
            featured: product.featured
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
            if (editing) {
                await axios.put(`/api/products/${editing}`, payload)
            } else {
                await axios.post('/api/products', payload)
            }
            setShowModal(false)
            fetchProducts()
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving product')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return
        try {
            await axios.delete(`/api/products/${id}`)
            fetchProducts()
        } catch (err) {
            alert('Error deleting product')
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
                        <h1>Products Management</h1>
                        <button className="btn btn-primary" onClick={openCreate}>
                            <Plus size={16} /> Add Product
                        </button>
                    </div>

                    {loading ? (
                        <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>SKU</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p._id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                                <img src={p.image} alt="" style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                    {p.featured && <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--primary)' }}>Featured</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{p.category}</td>
                                        <td style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-badge ${p.stock <= 5 ? 'status-failed' : 'status-paid'}`}>
                                                {p.stock}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{p.sku}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>
                                                    <Pencil size={14} />
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                            <h2 style={{ margin: 0 }}>{editing ? 'Edit Product' : 'New Product'}</h2>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Price ($)</label>
                                    <input type="number" step="0.01" className="form-input" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Stock</label>
                                    <input type="number" className="form-input" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                        {['Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Sports'].map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">SKU</label>
                                    <input className="form-input" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input className="form-input" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                            </div>
                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} id="featured" />
                                <label htmlFor="featured" style={{ color: 'var(--text-secondary)' }}>Featured Product</label>
                            </div>
                            <button type="submit" className="btn btn-primary btn-full btn-lg">
                                {editing ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

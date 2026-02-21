import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Minus, Plus, Package } from 'lucide-react'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useSocket } from '../context/SocketContext'

export default function ProductDetail() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const { addToCart } = useCart()
    const { socket } = useSocket()

    useEffect(() => {
        axios.get(`/api/products/${id}`)
            .then(res => { setProduct(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [id])

    // Listen for real-time inventory updates
    useEffect(() => {
        if (!socket) return
        const handler = ({ product: updated }) => {
            if (updated._id === id) {
                setProduct(prev => ({ ...prev, stock: updated.stock }))
            }
        }
        socket.on('inventory-update', handler)
        return () => socket.off('inventory-update', handler)
    }, [socket, id])

    if (loading) {
        return (
            <div className="page">
                <div className="container product-detail">
                    <div className="product-detail-layout">
                        <div className="skeleton" style={{ aspectRatio: 1, borderRadius: 'var(--radius-xl)' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                            <div className="skeleton" style={{ height: 16, width: 100 }} />
                            <div className="skeleton" style={{ height: 40, width: '80%' }} />
                            <div className="skeleton" style={{ height: 30, width: 120 }} />
                            <div className="skeleton" style={{ height: 80 }} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="page">
                <div className="container empty-state" style={{ minHeight: '60vh' }}>
                    <h2>Product not found</h2>
                    <Link to="/products" className="btn btn-primary mt-2">Back to Products</Link>
                </div>
            </div>
        )
    }

    const stockClass = product.stock > 10 ? 'stock-high' : product.stock > 3 ? 'stock-medium' : 'stock-low'
    const stockLabel = product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? `Only ${product.stock} left!` : `${product.stock} in stock`

    return (
        <div className="page">
            <div className="container product-detail">
                <Link to="/products" className="btn btn-ghost" style={{ marginBottom: 'var(--space-xl)' }}>
                    <ArrowLeft size={16} /> Back to Products
                </Link>
                <div className="product-detail-layout">
                    <div className="product-detail-image">
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className="product-detail-info">
                        <span className="product-detail-category">{product.category}</span>
                        <h1 className="product-detail-name">{product.name}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                            <span className="product-detail-price">${product.price.toFixed(2)}</span>
                            <span className={`stock-indicator ${stockClass}`}>
                                <Package size={14} /> {stockLabel}
                            </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', color: 'var(--warning)' }}>
                            {'★'.repeat(Math.floor(product.rating))}
                            <span style={{ color: 'var(--text-secondary)', marginLeft: 4 }}>
                                {product.rating} ({product.numReviews} reviews)
                            </span>
                        </div>

                        <p className="product-detail-desc">{product.description}</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                            <span>SKU: {product.sku}</span>
                            <span className="live-dot" title="Real-time tracking" /> Live Inventory
                        </div>

                        {product.stock > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginTop: 'var(--space-md)' }}>
                                <div className="cart-item-quantity">
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <span style={{ width: 40, textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={() => addToCart(product, quantity)}
                                    style={{ flex: 1 }}
                                >
                                    <ShoppingCart size={18} /> Add to Cart — ${(product.price * quantity).toFixed(2)}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

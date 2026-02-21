import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import api from '../api'
import ProductCard from '../components/ProductCard'
import { useSocket } from '../context/SocketContext'

const categories = ['All', 'Electronics', 'Clothing', 'Accessories', 'Home & Living', 'Sports']
const sortOptions = [
    { value: '', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'Name A-Z' },
]

export default function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('All')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')
    const { socket } = useSocket()

    const fetchProducts = () => {
        const params = new URLSearchParams()
        if (category !== 'All') params.append('category', category)
        if (search) params.append('search', search)
        if (sort) params.append('sort', sort)

        api.get(`/api/products?${params}`)
            .then(res => { setProducts(res.data); setLoading(false) })
            .catch(() => setLoading(false))
    }

    useEffect(() => {
        fetchProducts()
    }, [category, sort])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts()
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    // Real-time inventory updates
    useEffect(() => {
        if (!socket) return
        const handler = ({ product, action }) => {
            if (action === 'deleted') {
                setProducts(prev => prev.filter(p => p._id !== product._id))
            } else {
                setProducts(prev => {
                    const exists = prev.find(p => p._id === product._id)
                    if (exists) {
                        return prev.map(p => p._id === product._id ? product : p)
                    }
                    if (action === 'created') return [product, ...prev]
                    return prev
                })
            }
        }
        socket.on('inventory-update', handler)
        return () => socket.off('inventory-update', handler)
    }, [socket])

    return (
        <div className="page">
            <div className="container">
                <section className="section">
                    <div className="section-header">
                        <div>
                            <h1 className="section-title">All Products</h1>
                            <p className="section-subtitle">{products.length} products available</p>
                        </div>
                    </div>

                    <div className="filters-bar">
                        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                            <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search products..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ paddingLeft: 40 }}
                            />
                        </div>
                        <select
                            className="form-select"
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                            style={{ width: 'auto', minWidth: 160 }}
                        >
                            {sortOptions.map(o => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filters-bar" style={{ marginBottom: 'var(--space-xl)' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-chip ${category === cat ? 'active' : ''}`}
                                onClick={() => setCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="products-grid">
                            {[1, 2, 3, 4, 5, 6].map(i => (
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
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <Search size={48} />
                            <h3 style={{ marginTop: 'var(--space-md)' }}>No products found</h3>
                            <p>Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

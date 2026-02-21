import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
    const navigate = useNavigate()
    const { addToCart } = useCart()

    const getStockBadge = () => {
        if (product.stock === 0) return <span className="product-card-badge badge-out-of-stock">Sold Out</span>
        if (product.stock <= 5) return <span className="product-card-badge badge-low-stock">Low Stock</span>
        if (product.featured) return <span className="product-card-badge badge-featured">Featured</span>
        return null
    }

    const renderStars = (rating) => {
        return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '')
    }

    return (
        <div className="card product-card" onClick={() => navigate(`/products/${product._id}`)}>
            <div className="product-card-image">
                <img src={product.image} alt={product.name} loading="lazy" />
                {getStockBadge()}
            </div>
            <div className="product-card-body">
                <span className="product-card-category">{product.category}</span>
                <h3 className="product-card-name">{product.name}</h3>
                <div className="product-card-rating">
                    <span className="stars">{renderStars(product.rating)}</span>
                    <span>({product.numReviews})</span>
                </div>
                <div className="product-card-footer">
                    <span className="product-card-price">{product.price.toFixed(2)}</span>
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (product.stock > 0) addToCart(product)
                        }}
                        disabled={product.stock === 0}
                    >
                        <ShoppingCart size={14} />
                        {product.stock > 0 ? 'Add' : 'Sold Out'}
                    </button>
                </div>
            </div>
        </div>
    )
}

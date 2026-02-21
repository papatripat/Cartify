import { Link } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export default function OrderSuccess() {
    return (
        <div className="page">
            <div className="container">
                <div className="success-page">
                    <div className="success-icon">
                        <CheckCircle size={40} />
                    </div>
                    <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
                        Order Confirmed!
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)', maxWidth: 500, marginBottom: 'var(--space-2xl)' }}>
                        Thank you for your purchase! Your order has been successfully placed and payment confirmed.
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Continue Shopping <ArrowRight size={16} />
                        </Link>
                        <Link to="/" className="btn btn-secondary btn-lg">
                            <Package size={16} /> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

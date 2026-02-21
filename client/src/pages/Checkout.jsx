import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, Lock } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import api from '../api'
import { useCart } from '../context/CartContext'

const stripePromise = loadStripe('pk_test_51T3AMyCQK2zawLgjRIrTDEoN5s7cjjXeAYszvdADShKGtWFevrWsR4FhjC4kCt7xeWRwEHW9InDncehOIjASQUzk00B9tqd4RD')

const cardStyle = {
    style: {
        base: {
            color: '#1a1a2e',
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            '::placeholder': { color: '#9a9ab0' },
        },
        invalid: { color: '#e74c3c' },
    }
}

function CheckoutForm() {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const { items, totalPrice, clearCart } = useCart()
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState(null)
    const [shipping, setShipping] = useState({
        fullName: '', address: '', city: '', postalCode: '', country: ''
    })

    const total = totalPrice * 1.1

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!stripe || !elements) return

        // Validate shipping
        if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
            setError('Please fill in all shipping fields')
            return
        }

        setProcessing(true)
        setError(null)

        try {
            // Create PaymentIntent
            const { data } = await api.post('/api/payment/create-intent', {
                amount: total
            })

            // Confirm payment
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: shipping.fullName }
                }
            })

            if (result.error) {
                setError(result.error.message)
                setProcessing(false)
                return
            }

            // Create order
            await api.post('/api/orders', {
                items: items.map(i => ({
                    product: i._id,
                    name: i.name,
                    image: i.image,
                    price: i.price,
                    quantity: i.quantity
                })),
                shippingAddress: shipping,
                totalPrice: total,
                stripePaymentIntentId: result.paymentIntent.id
            })

            clearCart()
            navigate('/order-success')
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.')
            setProcessing(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="checkout-layout">
                <div>
                    <div className="checkout-section">
                        <h3><MapPin size={18} /> Shipping Address</h3>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" placeholder="John Doe" value={shipping.fullName}
                                onChange={e => setShipping({ ...shipping, fullName: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input className="form-input" placeholder="123 Main Street" value={shipping.address}
                                onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input className="form-input" placeholder="New York" value={shipping.city}
                                    onChange={e => setShipping({ ...shipping, city: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Postal Code</label>
                                <input className="form-input" placeholder="10001" value={shipping.postalCode}
                                    onChange={e => setShipping({ ...shipping, postalCode: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Country</label>
                            <input className="form-input" placeholder="United States" value={shipping.country}
                                onChange={e => setShipping({ ...shipping, country: e.target.value })} />
                        </div>
                    </div>

                    <div className="checkout-section">
                        <h3><CreditCard size={18} /> Payment Details</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>
                            <Lock size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Secured by Stripe. Your card info never touches our servers.
                        </p>
                        <div className="stripe-element">
                            <CardElement options={cardStyle} />
                        </div>
                        {error && (
                            <p style={{ color: 'var(--error)', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-md)' }}>
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        {items.map(item => (
                            <div key={item._id} className="summary-row">
                                <span>{item.name} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span style={{ color: 'var(--success)' }}>Free</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>${(totalPrice * 0.1).toFixed(2)}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-accent btn-full btn-lg"
                            disabled={!stripe || processing}
                            style={{ marginTop: 'var(--space-xl)' }}
                        >
                            {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
                            Test card: 4242 4242 4242 4242
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default function Checkout() {
    return (
        <div className="page">
            <div className="container">
                <h1 className="section-title" style={{ marginBottom: 'var(--space-lg)', paddingTop: 'var(--space-xl)' }}>
                    Checkout
                </h1>
                <Elements stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            </div>
        </div>
    )
}

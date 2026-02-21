import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await register(name, email, password)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        }
        setLoading(false)
    }

    return (
        <div className="auth-page">
            <div className="glass-card auth-card">
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    <span className="navbar-logo" style={{ fontSize: 'var(--font-size-3xl)' }}>Cartify</span>
                </div>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join Cartify today</p>

                {error && (
                    <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(231, 76, 60, 0.08)', border: '1px solid rgba(231, 76, 60, 0.2)', color: 'var(--error)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><User size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Full Name</label>
                        <input type="text" className="form-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Email</label>
                        <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><Lock size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Password</label>
                        <input type="password" className="form-input" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                        <UserPlus size={18} />
                        {loading ? 'Creating...' : 'Create Account'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign In</Link>
                </p>
            </div>
        </div>
    )
}

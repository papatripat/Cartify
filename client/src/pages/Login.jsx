import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const user = await login(email, password)
            navigate(user.role === 'admin' ? '/admin' : '/')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        }
        setLoading(false)
    }

    return (
        <div className="auth-page">
            <div className="glass-card auth-card">
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                    <span className="navbar-logo" style={{ fontSize: 'var(--font-size-3xl)' }}>Cartify</span>
                </div>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to your account</p>

                {error && (
                    <div style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(231, 76, 60, 0.08)', border: '1px solid rgba(231, 76, 60, 0.2)', color: 'var(--error)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-lg)' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label"><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Email</label>
                        <input type="email" className="form-input" placeholder="admin@cartify.com" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label"><Lock size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Password</label>
                        <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                        <LogIn size={18} />
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign Up</Link>
                </p>

                <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', background: 'rgba(108, 92, 231, 0.06)', border: '1px solid rgba(108, 92, 231, 0.15)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Demo Accounts:</strong><br />
                    Admin: admin@cartify.com / admin123<br />
                    User: john@example.com / user123
                </div>
            </div>
        </div>
    )
}

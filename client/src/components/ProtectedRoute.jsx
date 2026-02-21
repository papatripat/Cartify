import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className="page flex-center" style={{ minHeight: '100vh' }}>
            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
        </div>
    }

    if (!user) return <Navigate to="/login" replace />
    if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />

    return children
}

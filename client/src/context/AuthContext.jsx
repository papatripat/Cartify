import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const stored = localStorage.getItem('cartify_user')
        if (stored) {
            const parsed = JSON.parse(stored)
            setUser(parsed)
            api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password })
        setUser(data)
        localStorage.setItem('cartify_user', JSON.stringify(data))
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return data
    }

    const register = async (name, email, password) => {
        const { data } = await api.post('/api/auth/register', { name, email, password })
        setUser(data)
        localStorage.setItem('cartify_user', JSON.stringify(data))
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        return data
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('cartify_user')
        delete api.defaults.headers.common['Authorization']
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const stored = localStorage.getItem('cartify_cart')
        return stored ? JSON.parse(stored) : []
    })
    const [toast, setToast] = useState(null)

    useEffect(() => {
        localStorage.setItem('cartify_cart', JSON.stringify(items))
    }, [items])

    const showToast = (message) => {
        setToast(message)
        setTimeout(() => setToast(null), 3000)
    }

    const addToCart = (product, quantity = 1) => {
        setItems(prev => {
            const exists = prev.find(i => i._id === product._id)
            if (exists) {
                return prev.map(i =>
                    i._id === product._id
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                )
            }
            return [...prev, { ...product, quantity }]
        })
        showToast(`${product.name} added to cart!`)
    }

    const removeFromCart = (productId) => {
        setItems(prev => prev.filter(i => i._id !== productId))
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setItems(prev =>
            prev.map(i => i._id === productId ? { ...i, quantity } : i)
        )
    }

    const clearCart = () => {
        setItems([])
        localStorage.removeItem('cartify_cart')
    }

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, updateQuantity, clearCart,
            totalItems, totalPrice, toast
        }}>
            {children}
        </CartContext.Provider>
    )
}

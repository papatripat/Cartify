import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminInventory from './pages/admin/AdminInventory'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={
                    <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/order-success" element={
                    <ProtectedRoute><OrderSuccess /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                    <ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                    <ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                    <ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>
                } />
                <Route path="/admin/inventory" element={
                    <ProtectedRoute adminOnly><AdminInventory /></ProtectedRoute>
                } />
            </Routes>
        </>
    )
}

export default App

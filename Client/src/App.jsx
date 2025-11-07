import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import './styles/global.css'

import Sidebar from './layout/Sidebar.jsx'
import Navbar from './layout/Navbar.jsx'

// Pages
import Dashboard from './pages/dashboard/Dashboard.jsx'
import BillingList from './pages/billing/BillingList.jsx'
import CreateBill from './pages/billing/CreateBill.jsx'
import InvoiceView from './pages/billing/InvoiceView.jsx'
import DealerList from './pages/dealers/DealerList.jsx'
import DealerForm from './pages/dealers/DealerForm.jsx'
import ProductList from './pages/inventory/ProductList.jsx'
import AddProduct from './pages/inventory/AddProduct.jsx'
import StockUpdate from './pages/inventory/StockUpdate.jsx'
import SalesReport from './pages/reports/SalesReport.jsx'
import StockReport from './pages/reports/StockReport.jsx'
import ProfitLossReport from './pages/reports/ProfitLossReport.jsx'
import Settings from './pages/settings/Settings.jsx'
import Notifications from './pages/notifications/Notifications.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ProtectedRoute from './layout/ProtectedRoute.jsx'
import useAuth from './hooks/useAuth.js'

function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { isAuthenticated, logout } = useAuth()

  const path = location.pathname
  const activeKey =
    path.startsWith('/billing') ? 'billing' :
    path.startsWith('/dealers') ? 'dealers' :
    path.startsWith('/inventory') ? 'inventory' :
    path.startsWith('/reports') ? 'reports' :
    path.startsWith('/settings') ? 'settings' :
    path === '/' || path.startsWith('/dashboard') ? 'dashboard' : 'home'

  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register')

  return (
    <div className={`sb-app ${sidebarOpen ? '' : 'is-collapsed'}`}>
      {!isAuthRoute && (
        <Sidebar
        activeKey={activeKey}
        onNavigate={(key) => {
          if (key === 'logout') {
            logout()
            navigate('/login', { replace: true })
            return
          }
          if (key === '__hide_sidebar__') { setSidebarOpen(false); return }
          const map = {
            home: '/',
            dashboard: '/dashboard',
            billing: '/billing',
            dealers: '/dealers',
            inventory: '/inventory',
            reports: '/reports',
            'reports-stock': '/reports/stock',
            'reports-pl': '/reports/profit-loss',
            settings: '/settings'
          }
          navigate(map[key] || '/')
        }}
      />
      )}
      {!isAuthRoute && (
        <Navbar isSidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      )}
      <main className="sb-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Billing */}
          <Route path="/billing" element={<ProtectedRoute><BillingList /></ProtectedRoute>} />
          <Route path="/billing/create" element={<ProtectedRoute><CreateBill /></ProtectedRoute>} />
          <Route path="/billing/invoice/:id" element={<ProtectedRoute><InvoiceView /></ProtectedRoute>} />

          {/* Dealers */}
          <Route path="/dealers" element={<ProtectedRoute><DealerList /></ProtectedRoute>} />
          <Route path="/dealers/new" element={<ProtectedRoute><DealerForm /></ProtectedRoute>} />

          {/* Inventory */}
          <Route path="/inventory" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/inventory/new" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
          <Route path="/inventory/stock" element={<ProtectedRoute><StockUpdate /></ProtectedRoute>} />

          {/* Reports */}
          <Route path="/reports" element={<ProtectedRoute><SalesReport /></ProtectedRoute>} />
          <Route path="/reports/stock" element={<ProtectedRoute><StockReport /></ProtectedRoute>} />
          <Route path="/reports/profit-loss" element={<ProtectedRoute><ProfitLossReport /></ProtectedRoute>} />

          {/* Settings */}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Notifications */}
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

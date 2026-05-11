import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import CustomerPageList from './pages/CustomerPageList'
import CustomerProfilePage from './pages/CustomerProfilePage'
import CustomerNotesPage from './pages/CustomerNotesPage'

import CustomerAddPage from './pages/CustomerAddPage'
import CustomerEditPage from './pages/CustomerEditPage'
import CustomerAddNotePage from './pages/CustomerAddNotePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import JualanSabun from './pages/JualanSabunMinimal'
import JualanSabunList from './pages/JualanSabunList'
import CompanyApp from './CompanyApp'
import CompanyManagement from './pages/CompanyManagement'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/customer" element={<CustomerPageList />} />
          <Route path="/customer-profile/:id" element={<CustomerProfilePage />} />
          <Route path="/customer-notes/:id" element={<CustomerNotesPage />} />
          <Route path="/customer-add" element={<CustomerAddPage />} />
          <Route path="/customer-edit/:id" element={<CustomerEditPage />} />
          <Route path="/customer-add-note/:id" element={<CustomerAddNotePage />} />

          <Route path="/jualan-sabun" element={<JualanSabun />} />
          <Route path="/jualan-sabun-list" element={<JualanSabunList />} />

          {/* Company Management Routes */}
          <Route path="/company" element={<CompanyManagement />} />

          <Route path="*" element={<div>Route not found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

// Debug component to show current location
function LocationDebugger() {
  const location = useLocation()
  console.log('Current location:', location.pathname)
  return null
}

export default App
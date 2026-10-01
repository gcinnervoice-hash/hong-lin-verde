import { Navigate, Route, Routes } from 'react-router'
import Admin, { AdminLogin } from './pages/Admin'
import Home from './pages/Home'
import PlantDetail from './pages/PlantDetail'
import Plantas from './pages/Plantas'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/plantas" element={<Plantas />} />
      <Route path="/plantas/:slug" element={<PlantDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

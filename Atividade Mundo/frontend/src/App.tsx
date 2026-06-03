import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Continentes from './pages/Continentes'
import Paises from './pages/Paises'
import Cidades from './pages/Cidades'
import Detalhes from './pages/Detalhes'

function App() {
  const { usuario } = useAuth()

  return (
    <>
      {usuario && <Navbar />}
      <Routes>
        <Route path="/login" element={usuario ? <Navigate to="/continentes" /> : <Login />} />
        <Route path="/" element={<Navigate to="/continentes" />} />
        <Route path="/continentes" element={<ProtectedRoute><Continentes /></ProtectedRoute>} />
        <Route path="/paises" element={<ProtectedRoute><Paises /></ProtectedRoute>} />
        <Route path="/cidades" element={<ProtectedRoute><Cidades /></ProtectedRoute>} />
        <Route path="/detalhes/pais/:id" element={<ProtectedRoute><Detalhes tipo="pais" /></ProtectedRoute>} />
        <Route path="/detalhes/cidade/:id" element={<ProtectedRoute><Detalhes tipo="cidade" /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App

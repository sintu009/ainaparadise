import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Bookings from './pages/Bookings';
import Users from './pages/Users';
import Locations from './pages/Locations';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('admin_token') ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            padding: '10px 14px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          },
          success: {
            style: { background: '#0f2e28', color: '#fff' },
            iconTheme: { primary: '#6ee7b7', secondary: '#0f2e28' },
          },
          error: {
            style: { background: '#fff', color: '#dc2626', border: '1px solid #fecaca' },
            iconTheme: { primary: '#dc2626', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/users" element={<Users />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

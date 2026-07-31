import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, AdminRoute } from './components/ui/ProtectedRoute';
import ScrollToTop from './components/ui/ScrollToTop';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import UploadTrack from './pages/UploadTrack';
import ArtistProfile from './pages/ArtistProfile';
import Artists from './pages/Artists';
import Partnerships from './pages/Partnerships';
import Upcoming from './pages/Upcoming';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';
import AdminPanel from './pages/admin/AdminPanel';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                borderRadius: '10px',
                padding: '12px 18px',
              },
              success: { iconTheme: { primary: '#E8732A', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public pages with layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/services" element={<Layout><Services /></Layout>} />
            <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
            <Route path="/shop" element={<Layout><Shop /></Layout>} />
            <Route path="/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/blog/:id" element={<Layout><BlogPost /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/artist/:id" element={<Layout><ArtistProfile /></Layout>} />
            <Route path="/artists" element={<Layout><Artists /></Layout>} />
            <Route path="/partnerships" element={<Layout><Partnerships /></Layout>} />
            <Route path="/upcoming" element={<Layout><Upcoming /></Layout>} />
            <Route path="/terms" element={<Layout><Terms /></Layout>} />
            <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
            <Route path="/cookies" element={<Layout><CookiePolicy /></Layout>} />

            {/* Auth pages — no footer */}
            <Route path="/login" element={<Layout noFooter><Login /></Layout>} />
            <Route path="/register" element={<Layout noFooter><Register /></Layout>} />
            <Route path="/forgot-password" element={<Layout noFooter><ForgotPassword /></Layout>} />
            <Route path="/reset-password/:token" element={<Layout noFooter><ResetPassword /></Layout>} />

            {/* Protected: user dashboard */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard/upload" element={
              <ProtectedRoute>
                <Layout><UploadTrack /></Layout>
              </ProtectedRoute>
            } />

            {/* Protected: admin panel */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

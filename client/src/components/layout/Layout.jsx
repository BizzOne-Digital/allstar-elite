import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, noFooter }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '80px' }}>
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  );
}

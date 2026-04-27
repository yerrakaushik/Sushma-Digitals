import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SmoothScroll from './components/SmoothScroll';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import FloatingSocialBar from './components/FloatingSocialBar';

// Public Pages
import Home       from './pages/Home';
import Services   from './pages/Services';
import Gallery    from './pages/Gallery';
import YouTubePage from './pages/YouTube';
import BookNow    from './pages/BookNow';
import Designs    from './pages/Designs';

// Admin Pages (outside Navbar/Footer layout)
import AdminLogin     from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './admin/ProtectedRoute';
import AnniversaryIntro from './components/AnniversaryIntro';

function IntroController({ showIntro, setShowIntro }) {
  const location = window.location.pathname;
  const isAdmin = location.startsWith('/admin');
  
  if (isAdmin || !showIntro) return null;
  return <AnniversaryIntro onFinish={() => setShowIntro(false)} />;
}

function App() {
  const [showIntro, setShowIntro] = React.useState(true);

  // Global privacy protection for images and content
  React.useEffect(() => {
    const handleContext = (e) => e.preventDefault();
    const handleDrag = (e) => {
      if (e.target.tagName === 'IMG') e.preventDefault();
    };
    
    document.addEventListener('contextmenu', handleContext);
    document.addEventListener('dragstart', handleDrag);
    
    return () => {
      document.removeEventListener('contextmenu', handleContext);
      document.removeEventListener('dragstart', handleDrag);
    };
  }, []);

  return (
    <BrowserRouter>
      <IntroController showIntro={showIntro} setShowIntro={setShowIntro} />
      <SmoothScroll>
        <div className="noise-overlay" />
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Public routes */}
          <Route path="/*" element={
            <div className="bg-white min-h-screen text-navy font-sans flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/videos" element={<YouTubePage />} />
                  <Route path="/designs" element={<Designs />} />
                  <Route path="/book-now" element={<BookNow />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}

export default App;

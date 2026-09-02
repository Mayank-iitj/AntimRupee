import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ArrowRight, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, toggleLang } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();

  // Scroll to section or top on route change
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleNavClick = (path, hash) => {
    setIsMenuOpen(false);
    if (location.pathname !== path) {
      navigate(path + (hash ? `#${hash}` : ''));
    } else if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] relative overflow-hidden font-sans selection:bg-primary selection:text-white">
      {/* Shared Background Shapes (can be moved here so they persist across pages) */}
      <div className="fixed inset-0 bg-[#ffffff] z-[-2]"></div>
      <div className="fixed top-[5%] left-[-20%] w-[65vw] h-[80vw] bg-[#e3bdfc] opacity-[0.65] rounded-full blur-[160px] pointer-events-none z-[-1] transform -rotate-12" />
      <div className="fixed top-[-10%] right-[-20%] w-[70vw] h-[85vw] bg-[#8cbaf5] opacity-[0.55] rounded-full blur-[160px] pointer-events-none z-[-1] transform rotate-12" />
      <div className="fixed bottom-[-20%] left-[15%] w-[70vw] h-[50vw] bg-[#a1c4fd] opacity-[0.45] rounded-full blur-[140px] pointer-events-none z-[-1]" />

      {/* Sticky Floating Nav */}
      <div className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.nav 
          style={{ boxShadow: "0 20px 50px -10px rgba(130, 160, 245, 0.2)" }}
          className="pointer-events-auto flex items-center justify-between px-3 h-[60px] w-[420px] bg-white rounded-[20px] transition-all"
        >
          {/* Logo area */}
          <Link to="/" onClick={() => handleNavClick('/', '')} className="flex items-center gap-1 cursor-pointer pl-3">
            <span className="font-display font-bold text-xl text-[#7584D6] tracking-tight">antim</span>
            <span className="font-display font-medium text-xl text-[#a1c4fd] tracking-tight">rupee</span>
          </Link>
          
          {/* Center Grid Icon */}
          <div 
            className="flex items-center justify-center text-[#9dbbf8] hover:text-[#7584D6] transition-colors cursor-pointer p-2 rounded-full hover:bg-[#f4f7ff]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
               <circle cx="5" cy="5" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="19" cy="5" r="1.5"/>
               <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
               <circle cx="5" cy="19" r="1.5"/><circle cx="12" cy="19" r="1.5"/><circle cx="19" cy="19" r="1.5"/>
            </svg>
          </div>

          {/* Right Icons: Language Toggle & Auth */}
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 h-[42px] rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors border border-gray-100"
            >
              <Globe size={16} className="text-primary" />
              <span>{lang === 'en' ? 'EN' : 'हि'}</span>
            </button>
            {isAuthenticated ? (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="w-[42px] h-[42px] rounded-2xl bg-[#7584D6] hover:bg-[#6273c9] text-white flex items-center justify-center shadow-md transition-colors overflow-hidden">
                {user?.picture ? <img src={user.picture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>}
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-[42px] h-[42px] rounded-2xl bg-[#0A0A0A] hover:bg-gray-800 text-white flex items-center justify-center shadow-md transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
              </Link>
            )}
          </div>
        </motion.nav>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[76px] w-[340px] bg-white/90 backdrop-blur-3xl rounded-[24px] shadow-[0_30px_60px_-15px_rgba(130,160,245,0.3)] border border-white p-2 pointer-events-auto overflow-hidden"
            >
              <div className="flex flex-col gap-1 p-2">
                <button onClick={() => handleNavClick('/', 'features')} className="text-left px-4 py-3 hover:bg-[#f0f4ff] hover:text-[#7584D6] text-gray-600 font-medium rounded-xl transition-all">Features</button>
                <button onClick={() => handleNavClick('/', 'how-it-works')} className="text-left px-4 py-3 hover:bg-[#f0f4ff] hover:text-[#7584D6] text-gray-600 font-medium rounded-xl transition-all">How it works</button>
                <button onClick={() => handleNavClick('/', 'integrations')} className="text-left px-4 py-3 hover:bg-[#f0f4ff] hover:text-[#7584D6] text-gray-600 font-medium rounded-xl transition-all">Integrations</button>
                <button onClick={() => handleNavClick('/', 'faq')} className="text-left px-4 py-3 hover:bg-[#f0f4ff] hover:text-[#7584D6] text-gray-600 font-medium rounded-xl transition-all">FAQ</button>
                {isAuthenticated && (
                  <>
                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-left px-4 py-3 hover:bg-[#f0f4ff] hover:text-[#7584D6] text-gray-600 font-medium rounded-xl transition-all">State Dashboard</Link>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-left px-4 py-3 hover:bg-[#f0f4ff] hover:text-[#7584D6] text-gray-600 font-medium rounded-xl transition-all">My Profile</Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }} 
                      className="text-left px-4 py-3 hover:bg-red-50 hover:text-red-600 text-gray-600 font-medium rounded-xl transition-all"
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, filter: "blur(5px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(5px)" }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>

      {/* Styled Footer Section */}
      <div className="relative w-full overflow-hidden">
        {/* Massive overlapping text */}
        <div className="absolute top-[-40px] md:top-[-80px] left-0 right-0 flex justify-center pointer-events-none z-10 select-none">
          <span className="text-[120px] md:text-[280px] font-display font-bold leading-none tracking-tighter text-[#7e8ddd] opacity-90 drop-shadow-sm">
            antim
          </span>
        </div>

        <footer className="relative bg-[#7e8ddd] text-white pt-32 md:pt-48 pb-10 overflow-hidden z-20 mt-20 md:mt-40">
          <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-white/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="font-display font-bold text-5xl tracking-tight flex items-baseline">
                antim<sup className="text-xl ml-1 font-normal opacity-80">®</sup>
              </div>
              <p className="text-white text-lg leading-snug max-w-xs font-light mt-2">
                Empowering states to detect, analyze, and resolve stalled welfare payments instantly.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-1">
              <h3 className="text-3xl font-display font-medium tracking-tight">Stay in the Loop</h3>
              <p className="text-white/80 text-sm mb-8">Get updates on DPI initiatives.</p>
              
              <div className="relative border-b border-white/40 pb-2 flex items-center group w-full max-w-xs">
                <input 
                  type="email" 
                  placeholder="Government Email (.gov.in)" 
                  className="bg-transparent w-full outline-none text-white placeholder:text-white/70 text-sm"
                />
                <button className="text-white/70 group-hover:text-white transition-colors">
                  <ArrowRight size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-between md:pl-12">
              <div className="flex flex-col gap-4 text-sm text-white/90 font-light">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <Link to="/#features" className="hover:text-white transition-colors">Features</Link>
                <Link to="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
                <Link to="/#integrations" className="hover:text-white transition-colors">Integration</Link>
                <Link to="/dashboard" className="hover:text-white transition-colors">State Dashboard</Link>
                <Link to="/api-docs" className="hover:text-white transition-colors">API Docs</Link>
                <Link to="/#faq" className="hover:text-white transition-colors">FAQ</Link>
              </div>
              <div className="flex flex-col gap-4 text-sm text-white/90 font-light pr-12">
                <Link to="/about-us" className="hover:text-white transition-colors">About Us</Link>
                <Link to="/guidelines" className="hover:text-white transition-colors">Guidelines</Link>
                <Link to="/transparency" className="hover:text-white transition-colors">Transparency</Link>
                <Link to="/contact-support" className="hover:text-white transition-colors">Contact Support</Link>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 mt-32 relative z-10 text-xs text-white/60 font-light">
            <p>Copyright © Antim Rupee 2026</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

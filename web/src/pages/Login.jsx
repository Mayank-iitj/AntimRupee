import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, ArrowRight, ShieldAlert } from 'lucide-react';
import Beams from '../components/Beams';
import WarpText from '../components/WarpText';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google Auth Decoded:', decoded);
      
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        token: credentialResponse.credential,
        role: 'State Administrator' // Mock role
      };
      
      login(userData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error decoding token', err);
      setError('Failed to authenticate with Google.');
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    setError('Authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0A0A0A] font-sans">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={15}
          lightColor="#7584D6"
          beamColor="#0A0A0A"
          backgroundColor="#000000"
          speed={2.5}
          noiseIntensity={2.0}
          scale={0.15}
          rotation={-15}
        />
      </div>
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] z-0" />

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-8">
              <span className="font-display font-bold text-2xl text-[#7584D6] tracking-tight">antim</span>
              <span className="font-display font-medium text-2xl text-[#a1c4fd] tracking-tight">rupee</span>
            </div>
            <WarpText
              text="Secure Portal"
              color="#1D4ED8"
              warpStrength={0.08}
              warpScale={1.7}
              speed={0.55}
              pointerInfluence={0.42}
              pointerStrength={0.38}
              refraction={0.018}
              ripple={true}
              fontSize="2.5rem"
              fontWeight={800}
              style={{ height: '80px' }}
            />
            <p className="text-gray-400 text-sm">Sign in to access the Antim Rupee DPI State Dashboard.</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm mb-6"
            >
              <ShieldAlert size={16} className="shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {/* Action Area */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1c1c1c] text-gray-400 rounded-full">Government SSO</span>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                useOneTap
                theme="filled_black"
                shape="pill"
                size="large"
                width="300"
              />
            </div>

            <p className="text-center text-xs text-gray-500 mt-6">
              By signing in, you agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
            <ArrowRight size={14} className="rotate-180" /> Return to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}

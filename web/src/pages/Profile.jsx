import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, ShieldCheck, LogOut, Activity, ArrowRight, Settings, Bell, Lock } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white relative group"
            >
              {user.picture ? (
                <img src={user.picture} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <User size={40} className="text-primary" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-semibold">Change</span>
              </div>
            </motion.div>
            
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-display font-bold text-gray-900 mb-1 tracking-tight"
              >
                {user.name}
              </motion.h1>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 text-gray-500 font-medium"
              >
                <ShieldCheck size={16} className="text-emerald-500" />
                {user.role || 'State Administrator'}
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-md hover:bg-primary/90 hover:shadow-lg transition-all flex items-center gap-2"
            >
              State Dashboard <ArrowRight size={16} />
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-white text-red-600 border border-red-100 rounded-xl font-semibold shadow-sm hover:bg-red-50 transition-all flex items-center gap-2"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </motion.div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Account Details & Settings */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card bg-white p-6 rounded-3xl"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <User size={20} className="text-primary" /> Account Details
              </h3>
              
              <div className="space-y-5">
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Email Address</div>
                  <div className="flex items-center gap-2 text-gray-800 font-medium bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <Mail size={16} className="text-gray-400" />
                    {user.email}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Clearance Level</div>
                  <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100">
                    <span className="font-semibold flex items-center gap-2">
                      <Shield size={16} /> Level 3
                    </span>
                    <span className="text-xs font-bold uppercase">Verified</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card bg-white p-6 rounded-3xl"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                <Settings size={20} className="text-gray-500" /> Preferences
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Bell size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">Email Notifications</div>
                      <div className="text-xs text-gray-500">Alerts for batch failures</div>
                    </div>
                  </div>
                  <div className="w-11 h-6 bg-primary rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </label>
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 text-orange-500 rounded-lg group-hover:bg-orange-100 transition-colors">
                      <Lock size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">Two-Factor Auth</div>
                      <div className="text-xs text-gray-500">Require OTP for login</div>
                    </div>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </label>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Activity Timeline */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card bg-white p-8 rounded-3xl h-full"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity size={24} className="text-primary" /> Security & Activity Log
                </h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full border border-gray-200">Last 7 Days</span>
              </div>

              <div className="relative pl-6 border-l-2 border-gray-100 space-y-8">
                
                <div className="relative">
                  <div className="absolute -left-[33px] bg-white p-1 rounded-full border border-gray-200">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                    <div className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">Just Now</div>
                    <div className="font-semibold text-gray-900">Successful Login</div>
                    <div className="text-sm text-gray-600 mt-1">Authenticated via Google Single Sign-On.</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[33px] bg-white p-1 rounded-full border border-gray-200">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                    <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Yesterday, 14:32</div>
                    <div className="font-semibold text-gray-900">Exported Batch Annexure</div>
                    <div className="text-sm text-gray-600 mt-1">Exported forms for Branch: SBI Muzaffarpur (Cluster ID: C-4892)</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[33px] bg-white p-1 rounded-full border border-gray-200">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                    <div className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Tuesday, 09:15</div>
                    <div className="font-semibold text-gray-900">Marked Cluster Contacted</div>
                    <div className="text-sm text-gray-600 mt-1">Cleared 14 flagged workers for block ID: B_092</div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[33px] bg-white p-1 rounded-full border border-gray-200">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                  <div className="bg-red-50 border border-red-100 p-4 rounded-2xl">
                    <div className="text-xs font-bold text-red-500 mb-1 uppercase tracking-wider">Monday, 01:22</div>
                    <div className="font-semibold text-gray-900">Failed Login Attempt</div>
                    <div className="text-sm text-gray-600 mt-1">Unrecognized IP address from unauthorized region. Blocked by WAF.</div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

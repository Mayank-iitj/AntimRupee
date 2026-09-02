import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactSupport() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-screen relative z-10">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">Contact Support</h1>
          <p className="text-lg text-gray-600 font-light">
            Need help integrating your state MIS? Our technical team is here to assist.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 p-8 md:p-12 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {submitted ? (
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="text-center py-16">
              <CheckCircle2 className="mx-auto text-green-500 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Received</h3>
              <p className="text-gray-600">A nodal officer will respond to your registered .gov.in email address within 24 hours.</p>
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State / Department</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/50" placeholder="e.g. UP Rural Development" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gov Email</label>
                  <input type="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/50" placeholder="officer@nic.in" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/50 text-gray-700">
                  <option>API Integration / Credentials</option>
                  <option>Data Discrepancy in Dashboard</option>
                  <option>Request New Feature</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-white/50 resize-none" placeholder="Describe the issue..."></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
                Submit Ticket <Send size={18} />
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

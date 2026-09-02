import React from 'react';
import { motion } from 'framer-motion';
import { Lock, EyeOff } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-3xl shadow-xl border border-white/40"
      >
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
            <Lock size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-500">Effective Date: October 2026</p>
          </div>
        </div>

        <div className="prose prose-lg text-gray-600 max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-gray-800">
          <p className="lead text-xl text-gray-500 mb-8">
            The Antim Rupee DPI is committed to protecting the privacy and security of citizen data while ensuring the efficient delivery of government welfare.
          </p>

          <h3>1. Information We Process</h3>
          <p>
            The Antim Rupee platform ingests and processes data from the PFMS (Public Financial Management System) and state nodal bank ledgers. This includes:
          </p>
          <ul>
            <li><strong>Beneficiary Data:</strong> Job card IDs, masked Aadhaar numbers, local registry names, and bank passbook names.</li>
            <li><strong>Transaction Data:</strong> FTO (Fund Transfer Order) traces, rejection codes, and timestamp logs.</li>
            <li><strong>User Data:</strong> State officials' SSO login credentials, IP addresses, and audit logs of actions taken within the dashboard.</li>
          </ul>

          <h3>2. How We Use the Data</h3>
          <p>
            Data is strictly used for the resolution of silent exclusions. The platform utilizes AI models (including Gemini 1.5 Pro) to analyze raw trace logs. 
            <strong> Important:</strong> All PII (Personally Identifiable Information) is anonymized and stripped before any unstructured error logs are sent to the LLM decoding layer.
          </p>

          <h3>3. Data Sharing and Disclosure</h3>
          <p>
            We do not sell, rent, or trade beneficiary data. Information is only shared:
          </p>
          <ul>
            <li>With authorized banking partners (via generated Batch Annexures) strictly for the purpose of unfreezing accounts or correcting KYC issues.</li>
            <li>When required by law or valid legal process from appropriate government authorities.</li>
          </ul>

          <h3>4. Data Security</h3>
          <p>
            We implement state-of-the-art security measures including AES-256 encryption at rest and TLS 1.3 for data in transit. The platform features strict Role-Based Access Control (RBAC), and all user sessions and data exports are logged in an immutable audit trail.
          </p>

          <div className="mt-12 p-6 bg-secondary/5 rounded-2xl border border-secondary/10 flex items-start gap-4">
            <EyeOff className="text-secondary mt-1 shrink-0" size={24} />
            <p className="text-sm text-gray-700 m-0">
              <strong>Privacy by Design:</strong> Antim Rupee is built on the principle of data minimization. The AI decoding layer never sees citizen names, account numbers, or addresses. It only analyzes the technical system error codes.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

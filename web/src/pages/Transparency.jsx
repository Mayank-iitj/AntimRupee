import React from 'react';
import { motion } from 'framer-motion';

export default function Transparency() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen relative z-10">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 tracking-tight">Transparency Report</h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Open metrics on data processed, issues resolved, and system integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">Total FTOs Analyzed</p>
            <p className="text-3xl font-bold text-gray-900">42.5M</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">Systemic Anomalies Fixed</p>
            <p className="text-3xl font-bold text-primary">12,849</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 font-medium mb-1">Active State Nodes</p>
            <p className="text-3xl font-bold text-gray-900">14</p>
          </div>
        </div>

        <div className="prose prose-lg text-gray-600 max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Open Source Commitment</h2>
          <p>
            The core clustering algorithms and the React frontend dashboard are open source under the MIT License. We believe that digital public goods should be inspectable by the public.
          </p>
          <p>
            You can review the source code on our <a href="#" className="text-primary hover:underline">GitHub Repository</a>.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">Audit Logs</h2>
          <p>
            Quarterly security audits are performed by CERT-In empaneled agencies. The latest audit report (Q2 2026) showed zero critical vulnerabilities in the PII masking layer.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

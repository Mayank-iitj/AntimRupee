import React from 'react';
import { motion } from 'framer-motion';

export default function Guidelines() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen relative z-10">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 tracking-tight">Implementation Guidelines</h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Standard operating procedures for states adopting the Antim Rupee DPI.
          </p>
        </div>

        <div className="prose prose-lg text-gray-600 max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">1. Data Ingestion Protocol</h2>
          <p>States must provide read-only access to their transaction MIS via secure SFTP or NIC-approved REST APIs. The Antim Rupee engine will poll for FTO delta files every 6 hours.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">2. Security & PII</h2>
          <p>No PII (Personally Identifiable Information) may be transmitted in the raw traces. All beneficiary names, bank account numbers, and Aadhaar numbers must be masked using standard SHA-256 hashing at the state level before ingestion.</p>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">3. Agent Access Roles</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>State Admin:</strong> Can view aggregate dashboards and export anomaly reports.</li>
            <li><strong>District Nodal Officer:</strong> Can view specific actionable queues for their jurisdiction.</li>
            <li><strong>Block Operator:</strong> Read-only access to specific trace resolutions.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-4">4. SLA & Uptime</h2>
          <p>The core API maintains a 99.9% uptime SLA. Scheduled maintenance is performed during off-peak hours (12:00 AM - 4:00 AM IST) and is communicated via the state dashboard notifications.</p>
        </div>
      </motion.div>
    </div>
  );
}

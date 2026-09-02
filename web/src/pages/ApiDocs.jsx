import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, Shield, FileJson } from 'lucide-react';

export default function ApiDocs() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen relative z-10">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="uppercase tracking-[0.2em] text-xs font-bold text-primary mb-4">DEVELOPER DOCUMENTATION</div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6 tracking-tight">Antim Rupee API Reference</h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed">
            Directly connect your state MIS to the Antim Rupee FDR engine. Our REST API is secured with mutual TLS and requires NIC-approved endpoint registration.
          </p>
        </div>

        <div className="space-y-12">
          {/* Endpoint 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-green-100 text-green-700 font-mono text-sm font-bold rounded">POST</span>
              <code className="text-lg font-mono font-medium text-gray-800">/api/v1/fdr/analyze</code>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyze FTO Traces</h3>
            <p className="text-gray-600 mb-6">Submit a batch of failed Fund Transfer Orders (FTOs) for immediate root-cause clustering and action queue generation.</p>
            
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300">
                <span className="text-pink-400">curl</span> -X POST https://api.antimrupee.gov.in/api/v1/fdr/analyze \<br/>
                &nbsp;&nbsp;-H <span className="text-green-300">"Authorization: Bearer $NIC_TOKEN"</span> \<br/>
                &nbsp;&nbsp;-H <span className="text-green-300">"Content-Type: application/json"</span> \<br/>
                &nbsp;&nbsp;-d <span className="text-yellow-300">'{'{"state_code": "UP", "batch_id": "89234"}'}'</span>
              </pre>
            </div>
          </div>

          {/* Endpoint 2 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-mono text-sm font-bold rounded">GET</span>
              <code className="text-lg font-mono font-medium text-gray-800">/api/v1/stats/state/:code</code>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Retrieve State Statistics</h3>
            <p className="text-gray-600 mb-6">Fetch real-time aggregated metrics for the state dashboard. Excludes PII.</p>
            
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-gray-300">
                <span className="text-pink-400">curl</span> -X GET https://api.antimrupee.gov.in/api/v1/stats/state/UP \<br/>
                &nbsp;&nbsp;-H <span className="text-green-300">"Authorization: Bearer $NIC_TOKEN"</span>
              </pre>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

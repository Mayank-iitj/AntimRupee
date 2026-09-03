import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-3xl shadow-xl border border-white/40"
      >
        <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <FileText size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">Terms of Service</h1>
            <p className="text-gray-500">Effective Date: October 2026</p>
          </div>
        </div>

        <div className="prose prose-lg text-gray-600 max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-gray-800">
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using the Antim Rupee Digital Public Infrastructure (DPI) State Dashboard ("Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h3>2. Purpose of the Service</h3>
          <p>
            Antim Rupee is a secure, state-level dashboard designed to identify, analyze, and resolve "silent exclusions" in Direct Benefit Transfers (DBT). The Service provides authorized state officials and grievance redressal officers with analytics, ML-driven root cause analysis, and automated workflows.
          </p>

          <h3>3. User Responsibilities & Data Security</h3>
          <p>
            As a user of this government portal, you are granted access to sensitive citizen data (including PII) solely for the purpose of resolving benefit transfer failures. You agree to:
          </p>
          <ul>
            <li>Maintain the confidentiality of all citizen data accessed through the portal.</li>
            <li>Not export, share, or distribute data outside of authorized government workflows.</li>
            <li>Use the automated "Batch Annexure" generation feature only for official communication with banking partners.</li>
            <li>Report any suspected security vulnerabilities or unauthorized access immediately.</li>
          </ul>

          <h3>4. AI and Machine Learning Fallbacks</h3>
          <p>
            The Service utilizes large language models (such as Gemini 3.5 Pro) to decode unstructured banking error traces. While our deterministic engines guarantee 91% coverage, AI fallbacks are used for edge cases. Users should review AI-generated case briefings for accuracy before taking legal or administrative action.
          </p>

          <h3>5. Limitation of Liability</h3>
          <p>
            The Service is provided "as is" and "as available". The developers and affiliated state departments make no warranties, express or implied, regarding the continuous availability or absolute accuracy of the analytical models. We are not liable for actions taken by third-party banking institutions based on the generated reports.
          </p>

          <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
            <Shield className="text-primary mt-1 shrink-0" size={24} />
            <p className="text-sm text-gray-700 m-0">
              <strong>Official Government Portal:</strong> This system is strictly monitored. Unauthorized access, misuse of citizen data, or attempts to circumvent security protocols will result in immediate termination of access and potential legal action under applicable IT acts.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

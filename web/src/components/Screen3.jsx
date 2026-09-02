import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, CheckCircle2, Download, Eye, X, PhoneCall, TrendingUp, Sparkles, FileText, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { mockWorklist, generateMockWorker } from '../utils/mockData';

export default function Screen3() {
  const [worklist, setWorklist] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/worklist`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch worklist');
        return res.json();
      })
      .then(fetchedWorklist => {
        setWorklist(fetchedWorklist);
      })
      .catch(err => {
        console.error(err);
        setWorklist(mockWorklist);
      });
  }, []);

  const viewWorkerDetail = async (workerId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/worker/W_12345`, {
        headers: { 'Authorization': 'Bearer AUTH_TOKEN' }
      });
      if (!res.ok) throw new Error('Failed to fetch worker details');
      const data = await res.json();
      setSelectedWorker(data);
    } catch (err) {
      console.error(err);
      setSelectedWorker(generateMockWorker(workerId));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[800px] lg:h-[700px]">
      {/* Worklist Column */}
      <div className={`flex-1 glass-card p-4 lg:p-6 flex flex-col transition-all duration-500 bg-white ${selectedWorker ? 'lg:w-2/3 w-full' : 'w-full'}`}>
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ListTodo className="text-accent" size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900">Action Queue</h2>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
            <TrendingUp size={16} className="text-gray-500" />
            <select className="bg-transparent text-sm text-gray-700 border-none outline-none cursor-pointer">
              <option className="bg-white">Priority: Impact</option>
              <option className="bg-white">Priority: Value</option>
              <option className="bg-white">Priority: Urgency</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {worklist.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={item.cluster_id} 
              className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:bg-gray-50 hover:border-primary/50 transition-all overflow-hidden shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <PhoneCall size={18} className="text-primary" />
                    Call: Branch Manager, State Bank — {item.dimension_value}
                  </h3>
                  <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-mono font-medium text-primary">
                      SCORE {(item.priority * 100).toFixed(0)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Blocked</div>
                    <div className="text-xl font-display font-bold text-gray-900">{item.workers_affected}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Outstanding</div>
                    <div className="text-xl font-display font-bold text-gray-900">₹{item.unpaid_total.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Avg Pending</div>
                    <div className="text-xl font-display font-bold text-gray-900">{item.mean_days_pending}d</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                  <span className="text-red-600 font-semibold">{item.cause_code}</span>
                  <span className="mx-2">•</span>
                  Anomaly: {(item.group_rate*100).toFixed(1)}% vs {(item.baseline_rate*100).toFixed(1)}% baseline (q &lt; 0.01)
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      setWorklist(worklist.filter(w => w.cluster_id !== item.cluster_id));
                    }}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    <CheckCircle2 size={16} />
                    Mark Contacted
                  </button>
                  <button 
                    onClick={async () => {
                      const doc = new jsPDF();
                      doc.setFontSize(22);
                      doc.setTextColor(117, 132, 214);
                      doc.text('ANTIM RUPEE - BATCH ANNEXURE', 14, 20);
                      
                      doc.setFontSize(11);
                      doc.setTextColor(100, 100, 100);
                      doc.text(`Cluster ID: ${item.cluster_id}`, 14, 30);
                      doc.text(`Branch: ${item.dimension_value}`, 14, 36);
                      doc.text(`Root Cause: ${item.cause_code}`, 14, 42);
                      doc.text(`Affected Workers: ${item.workers_affected}`, 14, 48);
                      doc.text(`Outstanding Amount: Rs. ${item.unpaid_total.toLocaleString()}`, 14, 54);
                      
                      doc.setDrawColor(200, 200, 200);
                      doc.line(14, 60, 196, 60);
                      
                      doc.setTextColor(50, 50, 50);
                      doc.text('Action Required: Immediate unfreezing/correction of the following accounts.', 14, 70);
                      
                      // Generate some fake table data for the PDF
                      const tableData = Array.from({length: 10}).map((_, i) => [
                        `W_${Math.floor(Math.random()*90000)+10000}_UP`,
                        `UP-32-04-001-${Math.floor(Math.random()*999)}`,
                        'Pending Bank Action',
                        'Failure'
                      ]);
                      
                      autoTable(doc, {
                        startY: 75,
                        head: [['Worker ID', 'Jobcard ID', 'Status', 'Trace Result']],
                        body: tableData,
                        theme: 'striped',
                        headStyles: { fillColor: [117, 132, 214] }
                      });
                      
                      doc.save(`Batch_Annexure_${item.dimension_value}.pdf`);
                    }}
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download size={16} />
                    Export Forms
                  </button>
                  <button 
                    onClick={() => viewWorkerDetail('W_CLUSTER_0')} 
                    className="flex items-center gap-2 ml-auto text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                  >
                    <Eye size={16} />
                    View Trace
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drawer Column */}
      <AnimatePresence>
        {selectedWorker && (
          <motion.div 
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: typeof window !== 'undefined' && window.innerWidth < 1024 ? '100%' : '33.333333%' }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="glass-card bg-white flex flex-col relative overflow-hidden shadow-xl lg:static absolute inset-0 z-50 lg:z-auto"
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="text-primary" size={20} />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900">Worker Case File</h3>
              </div>
              <button onClick={() => setSelectedWorker(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
              {/* AI Case Briefing */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 mb-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-2xl rounded-full" />
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={18} className="text-primary" />
                  <h4 className="font-bold text-indigo-900">AI Case Briefing</h4>
                </div>
                <p className="text-sm text-indigo-800 leading-relaxed mb-4">
                  {selectedWorker.briefing || "Generating briefing..."}
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Verified PII Data</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Worker ID</div>
                    <div className="font-mono text-gray-900 font-medium">{selectedWorker.worker.worker_id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Job Card</div>
                    <div className="font-mono text-gray-900 font-medium">{selectedWorker.worker.jobcard_id}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Name (Local Registry)</div>
                    <div className="text-gray-900 font-medium">{selectedWorker.worker.name_local}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Name (Bank Passbook)</div>
                    <div className="text-gray-900 font-medium">{selectedWorker.worker.name_bank}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-5 shadow-sm text-gray-300">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Raw Bank Trace</div>
                  <div className="text-[10px] bg-gray-800 px-2 py-1 rounded text-gray-400 font-mono">system.log</div>
                </div>
                <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all border-l-2 border-emerald-500 pl-3 py-1">
                  {selectedWorker.trace}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

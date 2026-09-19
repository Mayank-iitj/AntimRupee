import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

export default function InspectorApp() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [tasks, setTasks] = useState([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load from local storage first
    const saved = localStorage.getItem('inspector_tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      fetchTasks();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchTasks = async () => {
    if (isOffline) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/worklist`);
      const data = await res.json();
      const mapped = data.slice(0, 10).map(d => ({
        id: d.cluster_id,
        location: d.dimension_value,
        issue: d.cause_code,
        status: 'pending' // pending, inspected
      }));
      setTasks(mapped);
      localStorage.setItem('inspector_tasks', JSON.stringify(mapped));
    } catch (e) {
      console.error(e);
    }
  };

  const markInspected = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: 'inspected' } : t);
    setTasks(updated);
    localStorage.setItem('inspector_tasks', JSON.stringify(updated));
  };

  const syncData = async () => {
    setSyncing(true);
    // Simulate syncing delay
    setTimeout(() => {
      const remaining = tasks.filter(t => t.status !== 'inspected');
      setTasks(remaining);
      localStorage.setItem('inspector_tasks', JSON.stringify(remaining));
      setSyncing(false);
      alert('Data synced successfully with headquarters!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-20 pt-8 px-4 max-w-lg mx-auto">
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Field Inspector</h1>
          <p className="text-sm text-gray-500">Offline-first mobile mode</p>
        </div>
        <div className={`p-3 rounded-full ${isOffline ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {isOffline ? <WifiOff size={24} /> : <Wifi size={24} />}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-700">My Task List</h2>
        <button 
          onClick={syncData}
          disabled={isOffline || syncing}
          className="flex items-center gap-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
          Sync
        </button>
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No tasks currently assigned.</div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="text-blue-500" size={18} />
                  <span className="font-bold text-gray-900">{task.id}</span>
                </div>
                {task.status === 'inspected' && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Done</span>}
              </div>
              <div className="text-sm text-gray-700 mb-1"><strong>Location:</strong> {task.location}</div>
              <div className="text-sm text-gray-700 mb-4"><strong>Issue:</strong> {task.issue}</div>
              
              {task.status === 'pending' && (
                <button 
                  onClick={() => markInspected(task.id)}
                  className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold"
                >
                  Mark as Inspected
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

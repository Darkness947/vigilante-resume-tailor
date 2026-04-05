import React from 'react';
import { createClient } from '@supabase/supabase-js';

// Enforce SSR execution specifically to inject secure Supabase tokens behind the scene.
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  let logs: any[] = [
    { id: '1', endpoint: '/api/parse', ip_hash: 'c4ca4238', latency: 345, created_at: new Date().toISOString(), status: '200' },
    { id: '2', endpoint: '/api/tailor', ip_hash: 'c81e728d', latency: 1240, created_at: new Date(Date.now()-10000).toISOString(), status: '200' },
    { id: '3', endpoint: '/api/pdf', ip_hash: 'eccbc87e', latency: 50, created_at: new Date(Date.now()-20000).toISOString(), status: '500' }
  ];

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
      if (!error && data) {
        logs = data;
      }
    } catch (e) {
      console.warn("Failed fetching audit_logs, using fallback mock data.");
    }
  }

  return (
    <div className="bg-[#0b0e11] min-h-screen text-[#f8f9fe] p-8 lg:p-12 font-sans selection:bg-[#00F2FF] selection:text-[#0b0e11]">
      
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight uppercase text-[#00f1fe] drop-shadow-[0_0_8px_rgba(0,241,254,0.3)]">Admin Overlook Protocol</h1>
          <p className="text-[#a9abaf] text-sm mt-2 max-w-xl">Strictly monitors anonymous endpoint usage and backend health without capturing PII according to Section 4 Admin Policies.</p>
        </header>

        <div className="bg-[#101417] p-8 rounded-3xl border border-[#1c2024] shadow-2xl">
          <table className="w-full text-left font-mono text-sm">
            <thead className="text-[#737679] border-b-2 border-[#1c2024]">
              <tr>
                 <th className="py-4 font-normal tracking-widest uppercase text-xs">Route Intercept</th>
                 <th className="font-normal tracking-widest uppercase text-xs">Hash Identifier</th>
                 <th className="font-normal tracking-widest uppercase text-xs">Latency Cycle</th>
                 <th className="font-normal tracking-widest uppercase text-xs">Ingress Timestamp</th>
                 <th className="font-normal tracking-widest uppercase text-xs text-right">Terminus Code</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                 <tr key={log.id} className="border-b border-[#161a1e] hover:bg-[#1c2024] cursor-default transition-colors">
                   <td className="py-4 text-[#d7e3fc]">{log.endpoint}</td>
                   <td className="text-[#a9abaf]">{log.ip_hash?.substring(0,8) || 'unknown'}...</td>
                   <td className="text-[#afc2ff]">{log.latency ?? '-'}ms</td>
                   <td className="text-[#737679]">{new Date(log.created_at).toLocaleTimeString()}</td>
                   <td className="text-right">
                     <span className={`px-2 py-1 bg-opacity-10 text-xs rounded-sm ${log.status === '200' ? 'bg-[#99f7ff] text-[#99f7ff]' : 'bg-[#ff716c] text-[#ff716c]'}`}>
                       {log.status}
                     </span>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

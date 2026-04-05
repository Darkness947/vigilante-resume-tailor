import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function AdminDashboard() {
  const user = await getUser();
  if (!user) {
    redirect('/en/auth/login');
  }

  // Fetch real logs from Supabase using service role if available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  let logs: any[] = [];

  if (supabaseUrl && supabaseKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (!error && data && data.length > 0) {
        logs = data;
      }
    } catch (e) {
      console.warn("Failed fetching audit_logs from Supabase.");
    }
  }

  // Only show demo data if no real data available
  if (logs.length === 0) {
    logs = [
      { id: '1', endpoint: '/api/parse', ip_hash: 'c4ca4238', latency: 345, created_at: new Date().toISOString(), status: '200' },
      { id: '2', endpoint: '/api/tailor', ip_hash: 'c81e728d', latency: 1240, created_at: new Date(Date.now() - 10000).toISOString(), status: '200' },
      { id: '3', endpoint: '/api/pdf', ip_hash: 'eccbc87e', latency: 50, created_at: new Date(Date.now() - 20000).toISOString(), status: '500' },
    ];
  }

  return (
    <div className="text-[#d7e3fc] p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight uppercase text-[#6bd8cb]">Admin Overlook Protocol</h1>
        <p className="text-[#737679] text-sm mt-1.5">Monitors anonymized endpoint usage. No PII is logged.</p>
        <p className="text-[#45484c] text-xs mt-1 font-mono">Authenticated as: {user.email}</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#101c2e] p-5 rounded-lg">
          <p className="text-xs text-[#737679] uppercase tracking-widest mb-1">Total Requests</p>
          <p className="text-2xl font-bold font-mono text-[#d7e3fc]">{logs.length}</p>
        </div>
        <div className="bg-[#101c2e] p-5 rounded-lg">
          <p className="text-xs text-[#737679] uppercase tracking-widest mb-1">Success Rate</p>
          <p className="text-2xl font-bold font-mono text-[#6bd8cb]">
            {logs.length > 0 ? Math.round((logs.filter(l => l.status === '200').length / logs.length) * 100) : 0}%
          </p>
        </div>
        <div className="bg-[#101c2e] p-5 rounded-lg">
          <p className="text-xs text-[#737679] uppercase tracking-widest mb-1">Avg Latency</p>
          <p className="text-2xl font-bold font-mono text-[#b8c4ff]">
            {logs.length > 0 ? Math.round(logs.reduce((a, l) => a + (l.latency || 0), 0) / logs.length) : 0}ms
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#101c2e] p-6 rounded-lg overflow-x-auto">
        <table className="w-full text-left font-mono text-sm">
          <thead className="text-[#45474c]">
            <tr className="border-b border-[#1c2024]">
              <th className="py-3 font-normal tracking-widest uppercase text-xs">Route</th>
              <th className="font-normal tracking-widest uppercase text-xs">Hash</th>
              <th className="font-normal tracking-widest uppercase text-xs">Latency</th>
              <th className="font-normal tracking-widest uppercase text-xs">Timestamp</th>
              <th className="font-normal tracking-widest uppercase text-xs text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id} className="border-b border-[#142032] hover:bg-[#142032] transition-colors">
                <td className="py-3 text-[#d7e3fc]">{log.endpoint}</td>
                <td className="text-[#737679]">{log.ip_hash?.substring(0, 8) || '—'}...</td>
                <td className="text-[#b8c4ff]">{log.latency ?? '—'}ms</td>
                <td className="text-[#45474c]">{new Date(log.created_at).toLocaleTimeString()}</td>
                <td className="text-right">
                  <span className={`px-2 py-0.5 text-xs rounded-sm font-bold ${log.status === '200' ? 'bg-[#004145] text-[#6bd8cb]' : 'bg-[#360001] text-[#ffb4ab]'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

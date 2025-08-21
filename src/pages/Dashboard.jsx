import { useEffect, useState } from 'react';
import api from '../api/api';

function FilterBar({ filters, setFilters, bases, onApply }) {
  return (
    <div style={{display:'flex', gap:8, alignItems:'end'}}>
      <div>
        <label>Base</label><br/>
        <select value={filters.base_id || ''} onChange={e=>setFilters(f=>({...f, base_id:e.target.value||null}))}>
          <option value="">All</option>
          {bases.map(b=> <option key={b.base_id} value={b.base_id}>{b.base_name}</option>)}
        </select>
      </div>
      <div>
        <label>Type</label><br/>
        <select value={filters.asset_type||''} onChange={e=>setFilters(f=>({...f, asset_type:e.target.value||null}))}>
          <option value="">All</option>
          <option>Vehicle</option><option>Weapon</option><option>Ammunition</option><option>Other</option>
        </select>
      </div>
      <div>
        <label>Start</label><br/>
        <input type="date" value={filters.start_date||''} onChange={e=>setFilters(f=>({...f, start_date:e.target.value||null}))} />
      </div>
      <div>
        <label>End</label><br/>
        <input type="date" value={filters.end_date||''} onChange={e=>setFilters(f=>({...f, end_date:e.target.value||null}))} />
      </div>
      <button onClick={onApply}>Apply</button>
    </div>
  );
}

function Metric({ title, value, onClick }) {
  return (
    <div onClick={onClick} style={{padding:12, border:'1px solid #eee', borderRadius:8, cursor:onClick?'pointer':'default'}}>
      <div style={{opacity:.6, fontSize:12}}>{title}</div>
      <div style={{fontSize:24, fontWeight:700}}>{value ?? 0}</div>
    </div>
  );
}

export default function Dashboard() {
  const [filters, setFilters] = useState({ base_id:null, asset_type:null, start_date:null, end_date:null });
  const [metrics, setMetrics] = useState(null);
  const [bases, setBases] = useState([]);
  const [nmItems, setNmItems] = useState([]);
  const [open, setOpen] = useState(false);

  // useEffect(()=>{ api.get('/bases').then(r=>setBases(r.data)); }, []);
  // const load = () => api.get('/dashboard', { params: filters }).then(r=>setMetrics(r.data));
  // useEffect(load, []);
useEffect(() => {
  async function loadBases() {
    const r = await api.get('/bases');
    setBases(r.data);
  }
  loadBases();
}, []);

const load = async () => {
  const r = await api.get('/dashboard', { params: filters });
  console.log('Dashboard metrics received:', r.data); // Add this line
  setMetrics(r.data);
};

useEffect(() => {
  load();
}, []);

  const openNM = async () => {
    const { data } = await api.get('/dashboard/net-movement-detail', { params: filters });
    setNmItems(data); setOpen(true);
  };

  return (
    <div style={{padding:24}}>
      <h1>Dashboard</h1>
      <FilterBar filters={filters} setFilters={setFilters} bases={bases} onApply={load} />
      <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(3, minmax(0,1fr))', marginTop:12}}>
        <Metric title="Opening Balance" value={metrics?.opening_balance} />
        <Metric title="Closing Balance" value={metrics?.closing_balance} />
        <Metric title="Net Movement" value={metrics?.net_movement} onClick={openNM} />
        <Metric title="Purchases" value={metrics?.breakdown?.purchases} />
        <Metric title="Transfer In" value={metrics?.breakdown?.transfer_in} />
        <Metric title="Transfer Out" value={metrics?.breakdown?.transfer_out} />
        <Metric title="Assigned" value={metrics?.breakdown?.assigned} />
        <Metric title="Expended" value={metrics?.breakdown?.expended} />
      </div>

      {open && (
        <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center'}} onClick={()=>setOpen(false)}>
          <div style={{background:'#fff', padding:16, borderRadius:8, maxHeight:'80vh', overflow:'auto'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3>Net Movement Details</h3>
              <button onClick={()=>setOpen(false)}>Close</button>
            </div>
            <table>
              <thead><tr><th>Time</th><th>Type</th><th>Asset</th><th>Qty</th><th>Related Base</th></tr></thead>
              <tbody>
                {nmItems.map(r=>(
                  <tr key={r.transaction_id}>
                    <td>{new Date(r.created_at).toLocaleString()}</td>
                    <td>{r.transaction_type}</td>
                    <td>{r.asset_name} ({r.asset_type})</td>
                    <td>{r.quantity}</td>
                    <td>{r.related_base ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


// export default function Dashboard() {
//   return <h1>Dashboard Page</h1>;
// }

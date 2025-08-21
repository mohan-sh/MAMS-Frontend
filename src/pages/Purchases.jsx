import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Purchases() {
  const [form, setForm] = useState({ base_id:'', asset_id:'', quantity:'', remarks:'' });
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({ base_id:'', asset_type:'', start_date:'', end_date:'' });

  useEffect(()=>{
    api.get('/bases').then(r=>setBases(r.data));
    api.get('/assets').then(r=>setAssets(r.data));
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/purchases', { ...form, quantity: Number(form.quantity) });
    setForm({ base_id:'', asset_id:'', quantity:'', remarks:'' });
    load();
  };

  const load = () => api.get('/purchases', { params: filters }).then(r=>setRows(r.data));

  return (
    <div style={{padding:24}}>
      <h1>Purchases</h1>
      <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8}}>
        <select value={form.base_id} onChange={e=>setForm(f=>({...f, base_id:e.target.value}))} required>
          <option value="">Base</option>
          {bases.map(b=><option key={b.base_id} value={b.base_id}>{b.base_name}</option>)}
        </select>
        <select value={form.asset_id} onChange={e=>setForm(f=>({...f, asset_id:e.target.value}))} required>
          <option value="">Asset</option>
          {assets.map(a=><option key={a.asset_id} value={a.asset_id}>{a.asset_name}</option>)}
        </select>
        <input type="number" min="1" placeholder="Qty" value={form.quantity} onChange={e=>setForm(f=>({...f, quantity:e.target.value}))} required />
        <input placeholder="Remarks" value={form.remarks} onChange={e=>setForm(f=>({...f, remarks:e.target.value}))} />
        <button>Record</button>
      </form>

      <div style={{display:'flex', gap:8, marginTop:12}}>
        <select value={filters.base_id} onChange={e=>setFilters(f=>({...f, base_id:e.target.value}))}>
          <option value="">All Bases</option>
          {bases.map(b=><option key={b.base_id} value={b.base_id}>{b.base_name}</option>)}
        </select>
        <select value={filters.asset_type} onChange={e=>setFilters(f=>({...f, asset_type:e.target.value}))}>
          <option value="">All Types</option>
          <option>Vehicle</option><option>Weapon</option><option>Ammunition</option><option>Other</option>
        </select>
        <input type="date" value={filters.start_date} onChange={e=>setFilters(f=>({...f, start_date:e.target.value}))} />
        <input type="date" value={filters.end_date} onChange={e=>setFilters(f=>({...f, end_date:e.target.value}))} />
        <button onClick={load}>Apply</button>
      </div>

      <table style={{marginTop:12}}>
        <thead><tr><th>Time</th><th>Base</th><th>Asset</th><th>Type</th><th>Qty</th><th>Remarks</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.transaction_id}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.base_id}</td>
              <td>{r.asset_name}</td>
              <td>{r.asset_type}</td>
              <td>{r.quantity}</td>
              <td>{r.remarks || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



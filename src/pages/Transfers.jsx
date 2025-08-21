import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Transfers() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ from_base_id:'', to_base_id:'', asset_id:'', quantity:'', remarks:'' });
  const [rows, setRows] = useState([]);

  useEffect(()=>{
    api.get('/bases').then(r=>setBases(r.data));
    api.get('/assets').then(r=>setAssets(r.data));
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/transfers', { ...form, quantity:Number(form.quantity) });
    setForm({ from_base_id:'', to_base_id:'', asset_id:'', quantity:'', remarks:'' });
    load();
  };

  const load = () => api.get('/transfers').then(r=>setRows(r.data));

  return (
    <div style={{padding:24}}>
      <h1>Transfers</h1>
      <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8}}>
        <select value={form.from_base_id} onChange={e=>setForm(f=>({...f, from_base_id:e.target.value}))} required>
          <option value="">From Base</option>
          {bases.map(b=><option key={b.base_id} value={b.base_id}>{b.base_name}</option>)}
        </select>
        <select value={form.to_base_id} onChange={e=>setForm(f=>({...f, to_base_id:e.target.value}))} required>
          <option value="">To Base</option>
          {bases.map(b=><option key={b.base_id} value={b.base_id}>{b.base_name}</option>)}
        </select>
        <select value={form.asset_id} onChange={e=>setForm(f=>({...f, asset_id:e.target.value}))} required>
          <option value="">Asset</option>
          {assets.map(a=><option key={a.asset_id} value={a.asset_id}>{a.asset_name}</option>)}
        </select>
        <input type="number" min="1" placeholder="Qty" value={form.quantity} onChange={e=>setForm(f=>({...f, quantity:e.target.value}))} required />
        <input placeholder="Remarks" value={form.remarks} onChange={e=>setForm(f=>({...f, remarks:e.target.value}))} />
        <button>Transfer</button>
      </form>

      <table style={{marginTop:12}}>
        <thead><tr><th>Time</th><th>Type</th><th>Asset</th><th>Qty</th><th>Base</th><th>Related</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.transaction_id}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.transaction_type}</td>
              <td>{r.asset_name} ({r.asset_type})</td>
              <td>{r.quantity}</td>
              <td>{r.base_id}</td>
              <td>{r.related_base ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// export default function Transfers() {
//   return <h1>Transfer Page</h1>;
// }

import { useEffect, useState } from 'react';
import api from '../api/api';

export default function Assignments() {
  const [bases, setBases] = useState([]);
  const [assets, setAssets] = useState([]);
  const [rows, setRows] = useState([]);
  const [assign, setAssign] = useState({ base_id:'', asset_id:'', quantity:'', remarks:'' });
  const [expend, setExpend] = useState({ base_id:'', asset_id:'', quantity:'', remarks:'' });

  useEffect(()=>{
    api.get('/bases').then(r=>setBases(r.data));
    api.get('/assets').then(r=>setAssets(r.data));
    load();
  }, []);

  const submitAssign = async (e) => {
    e.preventDefault();
    await api.post('/assignments/assign', { ...assign, quantity:Number(assign.quantity) });
    setAssign({ base_id:'', asset_id:'', quantity:'', remarks:'' });
    load();
  };

  const submitExpend = async (e) => {
    e.preventDefault();
    await api.post('/assignments/expend', { ...expend, quantity:Number(expend.quantity) });
    setExpend({ base_id:'', asset_id:'', quantity:'', remarks:'' });
    load();
  };

  const load = () => api.get('/assignments').then(r=>setRows(r.data));

  return (
    <div style={{padding:24}}>
      <h1>Assignments & Expenditures</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16}}>
        <form onSubmit={submitAssign} style={{display:'grid', gap:8}}>
          <h3>Assign</h3>
          <select value={assign.base_id} onChange={e=>setAssign(f=>({...f, base_id:e.target.value}))} required>
            <option value="">Base</option>
            {bases.map(b=><option key={b.base_id} value={b.base_id}>{b.base_name}</option>)}
          </select>
          <select value={assign.asset_id} onChange={e=>setAssign(f=>({...f, asset_id:e.target.value}))} required>
            <option value="">Asset</option>
            {assets.map(a=><option key={a.asset_id} value={a.asset_id}>{a.asset_name}</option>)}
          </select>
          <input type="number" min="1" placeholder="Qty" value={assign.quantity} onChange={e=>setAssign(f=>({...f, quantity:e.target.value}))} required />
          <input placeholder="Remarks" value={assign.remarks} onChange={e=>setAssign(f=>({...f, remarks:e.target.value}))} />
          <button>Assign</button>
        </form>

        <form onSubmit={submitExpend} style={{display:'grid', gap:8}}>
          <h3>Expend</h3>
          <select value={expend.base_id} onChange={e=>setExpend(f=>({...f, base_id:e.target.value}))} required>
            <option value="">Base</option>
            {bases.map(b=><option key={b.base_id} value={b.base_id}>{b.base_name}</option>)}
          </select>
          <select value={expend.asset_id} onChange={e=>setExpend(f=>({...f, asset_id:e.target.value}))} required>
            <option value="">Asset</option>
            {assets.map(a=><option key={a.asset_id} value={a.asset_id}>{a.asset_name}</option>)}
          </select>
          <input type="number" min="1" placeholder="Qty" value={expend.quantity} onChange={e=>setExpend(f=>({...f, quantity:e.target.value}))} required />
          <input placeholder="Remarks" value={expend.remarks} onChange={e=>setExpend(f=>({...f, remarks:e.target.value}))} />
          <button>Record</button>
        </form>
      </div>

      <table style={{marginTop:12}}>
        <thead><tr><th>Time</th><th>Type</th><th>Asset</th><th>Qty</th><th>Base</th><th>Remarks</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.transaction_id}>
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.transaction_type}</td>
              <td>{r.asset_name} ({r.asset_type})</td>
              <td>{r.quantity}</td>
              <td>{r.base_id}</td>
              <td>{r.remarks || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

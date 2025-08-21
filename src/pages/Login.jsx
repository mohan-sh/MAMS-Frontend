import { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username:'', password:'' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      window.location.href = '/dashboard';
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{display:'grid', placeItems:'center', height:'80vh'}}>
      <form onSubmit={submit} style={{display:'grid', gap:8, padding:20, border:'1px solid #eee', borderRadius:8}}>
        <h2>Login</h2>
        <input placeholder="Username" value={form.username} onChange={e=>setForm(f=>({...f, username:e.target.value}))} />
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} />
        {err && <div style={{color:'crimson'}}>{err}</div>}
        <button>Sign in</button>
      </form>
    </div>
  );
}

import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Purchases from './pages/Purchases.jsx'
import Transfers from './pages/Transfers.jsx'
import Assignments from './pages/Assignments.jsx'

function Guard({ children }) {
  const { user } = useAuth();
  console.log("User in Guard:", user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}



function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen">
      <nav style={{display:'flex', gap:12, padding:12, borderBottom:'1px solid #eee'}}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/purchases">Purchases</Link>
        <Link to="/transfers">Transfers</Link>
        <Link to="/assignments">Assignments</Link>
        <span style={{marginLeft:'auto'}}>
          {user && <>
            <b>{user.username}</b> ({user.role_name}{user.base_id?` @ base ${user.base_id}`:''}) | <button onClick={logout}>Logout</button>
          </>}
        </span>
      </nav>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/" element={<Guard><Layout /></Guard>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="transfers" element={<Transfers />} />
        <Route path="assignments" element={<Assignments />} />
      </Route>

      </Routes>
    </AuthProvider>
  );
}


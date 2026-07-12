<<<<<<< HEAD
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('unreachable'));
  }, []);

  return (
    <div>
      <h1>TransitOps</h1>
      <p>Smart Transport Operations Platform</p>
      <p>Backend status: {status}</p>
    </div>
  );
=======
import AppRoutes from './routes';
import './styles/globals.css';

function App() {
  return <AppRoutes />;
>>>>>>> 8da34bd (feat: initialize React frontend structure)
}

export default App;

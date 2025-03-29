// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function App() {
  const [dryRun, setDryRun] = useState(true);
  const [status, setStatus] = useState({});
  const [spreadData, setSpreadData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loginMode, setLoginMode] = useState(false);

  const fetchStatus = async () => {
    const res = await axios.get('/api/status');
    setStatus(res.data);
    if (res.data.dexPrice && res.data.cexPrice) {
      const spread = ((res.data.cexPrice - res.data.dexPrice) / res.data.dexPrice) * 100;
      const timestamp = new Date().toLocaleTimeString();
      setSpreadData(prev => [...prev.slice(-19), { time: timestamp, spread: +spread.toFixed(2) }]);
    }
  };

  const fetchSettings = async () => {
    const res = await axios.get('/api/settings');
    setDryRun(res.data.dryRun);
  };

  const toggleDryRun = async () => {
    setLoading(true);
    await axios.post('/api/settings', { dryRun: !dryRun });
    setDryRun(!dryRun);
    setLoading(false);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = loginMode ? '/api/login' : '/api/register';
    try {
      const res = await axios.post(endpoint, form);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      console.error('Auth error:', err);
      alert('Authentication failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const verifyToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data.user);
    } catch (err) {
      console.warn('Token invalid or expired. Logging out.');
      logout();
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchSettings();
    verifyToken();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <motion.div
        className="min-h-screen bg-gray-900 text-white p-6 font-sans flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">{loginMode ? 'Login' : 'Register'}</h2>
        <motion.form
          onSubmit={handleAuth}
          className="w-full max-w-sm bg-gray-800 p-6 rounded-xl space-y-4 shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {!loginMode && (
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 rounded bg-gray-700 text-white shadow-inner"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 rounded bg-gray-700 text-white shadow-inner"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded bg-gray-700 text-white shadow-inner"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            className="w-full bg-green-600 p-2 rounded font-bold hover:bg-green-500"
          >
            {loginMode ? 'Login' : 'Register'}
          </motion.button>
          <button
            type="button"
            onClick={() => setLoginMode(!loginMode)}
            className="w-full text-sm text-blue-400 hover:text-blue-300 mt-2"
          >
            {loginMode ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </motion.form>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-900 text-white p-6 font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PancakeSwap–Blofin Arbitrage Bot</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-500"
        >
          Logout
        </motion.button>
      </div>

      <motion.div
        className="bg-gray-800 p-4 rounded-xl shadow mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <p><span className="font-semibold">Status:</span> {status.message}</p>
        <p><span className="font-semibold">Time:</span> {status.timestamp}</p>
      </motion.div>

      <motion.div
        className="bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <p className="font-semibold">Dry Run Mode:</p>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={toggleDryRun}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${dryRun ? 'bg-yellow-500' : 'bg-green-500'} hover:opacity-90`}
        >
          {dryRun ? 'ON' : 'OFF'}
        </motion.button>
      </motion.div>

      <motion.div
        className="bg-gray-800 p-4 rounded-xl shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold mb-2">Live Spread Chart (CEX vs DEX)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={spreadData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis domain={['auto', 'auto']} stroke="#ccc" tickFormatter={v => `${v}%`} />
            <Tooltip />
            <Line type="monotone" dataKey="spread" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}

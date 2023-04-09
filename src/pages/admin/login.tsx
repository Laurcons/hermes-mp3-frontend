import { useState } from 'react';
import Layout from '../../components/Layout';
import Cookies from 'js-cookie';
import { axios } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      const res = await axios.post('/session', {
        username,
        password,
      });
      const { token } = res.data;
      Cookies.set('adminToken', token, { sameSite: 'strict' });
      navigate('/admin');
    } catch (err: any) {
      setError(err.toString());
    }
  }

  return (
    <Layout isAdmin={true}>
      <div className="max-w-md mx-auto p-2 px-3 border border-black rounded">
        Autentificare in Panoul de Control
        <div className="mb-2">
          <label className="block">Username</label>
          <input
            className="border rounded p-1 w-full"
            type="text"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
        </div>
        <div className="mb-2">
          <label className="block">Parola</label>
          <input
            className="border rounded p-1 w-full"
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>
        <button
          className="bg-slate-800 text-white rounded p-2 px-3"
          onClick={handleSubmit}
        >
          Autentificare
        </button>
      </div>
    </Layout>
  );
}

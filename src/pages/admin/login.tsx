import { useState } from 'react';
import Layout from '../../components/Layout';
import Cookies from 'js-cookie';
import { axios, handleErrors } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import CookieManager from '@/lib/cookie-manager';
import { toast } from 'react-toastify';
import { UserRole } from '@/types/user';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const res = await axios.post('/session', {
        username,
        password,
      });
      const { token, role } = res.data;
      if (role === UserRole.admin) {
        CookieManager.set('adminToken', token);
        navigate('/admin');
      } else if (role === UserRole.volunteer) {
        CookieManager.set('volunteerToken', token);
        navigate('/volunteer');
      } else {
        console.error('Unknown user type');
      }
    } catch (err: any) {
      handleErrors(err);
    } finally {
      setIsLoading(false);
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
        <Button
          isLoading={isLoading}
          className="bg-slate-800 text-white rounded p-2 px-3"
          onClick={handleSubmit}
        >
          Autentificare
        </Button>
      </div>
    </Layout>
  );
}

import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Layout>
      <p>Bine ai venit la Hermes MP3 Experience!</p>
      <p>Pentru a incepe, bifeaza casuta de mai jos.</p>
      <div className="p-3 flex gap-3">
        <input
          type="checkbox"
          id="aaa"
          onClick={() => setTimeout(() => navigate('/chat'), 500)}
        />
        <label htmlFor="aaa">Nu sunt un robot</label>
      </div>
    </Layout>
  );
}

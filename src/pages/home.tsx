import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import IAmNotARobot from '../components/IAmNotARobot';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Layout>
      <p>Bine ai venit la Hermes MP3 Experience!</p>
      <p>Pentru a incepe, bifeaza casuta de mai jos.</p>
      <IAmNotARobot onChange={(tok) => navigate(`/chat?recaptcha=${tok}`)} />
    </Layout>
  );
}

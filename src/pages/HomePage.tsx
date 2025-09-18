
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate('/provider-login')}>
        Sign in as a Provider
      </button>
    </div>
  );
}



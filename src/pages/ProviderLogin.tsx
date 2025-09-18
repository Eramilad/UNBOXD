
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProviderLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert(error.message);

    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('*')
      .eq('email', email)
      .single();

    if (providerError || !provider) {
      alert('Not a registered provider');
    } else {
      navigate('/provider-dashboard');
    }
  };

  return (
    <div>
      <h2>Provider Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}



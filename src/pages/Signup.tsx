
import React from 'react';
import SignupHeader from '@/components/auth/SignupHeader';
import SignupForm from '@/components/auth/SignupForm';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    // After successful signup, redirect to earn with unboxd page
    navigate('/earn-with-unboxd');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupHeader />
        <SignupForm onSuccess={handleSignupSuccess} />
      </div>
    </div>
  );
};

export default Signup;

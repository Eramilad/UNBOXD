
import React from 'react';
import { Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignupHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </button>
      <div className="flex items-center justify-center mb-4">
        <Package className="h-8 w-8 text-blue-500 mr-2" />
        <span className="text-2xl font-bold text-gray-900">unboxd</span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
      <p className="text-gray-600 mt-2">Create your account to start using unboxd</p>
    </div>
  );
};

export default SignupHeader;

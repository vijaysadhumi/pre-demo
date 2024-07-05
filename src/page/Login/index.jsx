import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/chat');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="input" className="block text-gray-700 font-semibold mb-2">
              Enter Organisation Name
            </label>
            <input
              type="text"
              id="input"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Google..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md transition duration-300"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle, checkIfUserAuthenticated } from '../../lib/firebaseServices';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await checkIfUserAuthenticated();
      if (isAuthenticated) {
        navigate('/admin');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await signIn(email, password);
      
      if (user) {
        // Redirect to dashboard or home page after successful login
        navigate('/admin');
      }
    } catch (error) {
      // Error handling is now managed in the authServices
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigate('/admin');
      }
    } catch (error) {
      // Error handling is now managed in the authServices
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
          >
            <i className="fa fa-lock fa-lg mr-2" aria-hidden="true"></i>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-4 w-full my-2 py-2 px-4 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center cursor-pointer"
          >
            <i className="fa-brands fa-google fa-lg mr-2" aria-hidden="true"></i> 
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        </form>
      </div>
    </div>
  );
}
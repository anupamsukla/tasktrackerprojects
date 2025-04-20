import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isLogin
              ? 'Enter your credentials to access your tasks'
              : 'Sign up to start tracking your tasks'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md flex items-start">
            <X 
              size={20} 
              className="mr-2 flex-shrink-0 mt-0.5" 
            />
            <p>{error}</p>
          </div>
        )}

        {error && error.includes('confirmation') && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md flex">
            <CheckCircle 
              size={20} 
              className="mr-2 flex-shrink-0 mt-0.5" 
            />
            <p>Registration successful! Check your email to confirm your account.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              minLength={6}
              required
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              isLoading={loading}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
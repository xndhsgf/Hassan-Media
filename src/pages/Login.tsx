import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate, useLocation } from 'react-router';
import { Key } from 'lucide-react';

export default function Login() {
  const { login, register } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isRegistering = location.pathname.includes('register');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      if(email.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Key className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="text-center text-slate-500 text-sm mb-6">
          {isRegistering ? 'Sign up to manage your keys and orders.' : 'Enter your credentials to access your account.'}<br/>
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 bg-slate-50 focus:bg-white"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 bg-slate-50 focus:bg-white"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-4"
          >
            {isLoading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
           {isRegistering ? (
             <p>Already have an account? <button onClick={() => navigate('/login')} className="text-indigo-600 hover:underline">Sign in</button></p>
           ) : (
             <p>Don't have an account? <button onClick={() => navigate('/register')} className="text-indigo-600 hover:underline">Create one</button></p>
           )}
        </div>
      </div>
    </div>
  );
}

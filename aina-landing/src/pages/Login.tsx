import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollToTop } from '../components';
import { authAPI } from '../api';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(form.email, form.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success(`Welcome back, ${data.user.name}!`);
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-room bg-cover bg-center flex items-center justify-center" style={{ backgroundAttachment: 'fixed' }}>
      <Toaster position="top-right" />
      <ScrollToTop />
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 p-10">
          <h2 className="font-primary text-3xl text-primary mb-1 text-center">Welcome Back</h2>
          <p className="font-tertiary tracking-[2px] text-accent text-sm uppercase text-center mb-8">Sign in to your account</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="font-tertiary tracking-[2px] text-xs uppercase text-primary/70">Email Address</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-primary/20 px-4 py-3 font-secondary text-sm text-primary outline-none focus:border-accent transition-colors"
                placeholder="your@email.com" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-tertiary tracking-[2px] text-xs uppercase text-primary/70">Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-primary/20 px-4 py-3 font-secondary text-sm text-primary outline-none focus:border-accent transition-colors"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="bg-accent hover:bg-accent-hover text-white font-tertiary tracking-[3px] uppercase text-sm py-4 transition-colors mt-2 disabled:opacity-60">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          <p className="font-secondary text-sm text-primary/60 text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:text-accent-hover transition-colors">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

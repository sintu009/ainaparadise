import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ScrollToTop } from '../components';
import { authAPI } from '../api';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form.name, form.email, form.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Account created!');
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-room bg-cover bg-center flex items-center justify-center" style={{ backgroundAttachment: 'fixed' }}>
      <Toaster position="top-right" />
      <ScrollToTop />
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 w-full max-w-md mx-4 py-24">
        <div className="bg-white/95 p-10">
          <h2 className="font-primary text-3xl text-primary mb-1 text-center">Create Account</h2>
          <p className="font-tertiary tracking-[2px] text-accent text-sm uppercase text-center mb-8">Join us for a luxury experience</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: '••••••••' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="font-tertiary tracking-[2px] text-xs uppercase text-primary/70">{label}</label>
                <input type={type} required value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="border border-primary/20 px-4 py-3 font-secondary text-sm text-primary outline-none focus:border-accent transition-colors"
                  placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="bg-accent hover:bg-accent-hover text-white font-tertiary tracking-[3px] uppercase text-sm py-4 transition-colors mt-2 disabled:opacity-60">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="font-secondary text-sm text-primary/60 text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-hover transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

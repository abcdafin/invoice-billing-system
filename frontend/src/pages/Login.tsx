import { useState } from 'react';


import { useNavigate, Link } from 'react-router-dom';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useRHForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await api.post('/auth/login', data);
      setAuth(response.data.data, response.data.token);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to login';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-orange/30 flex">
      {/* Left side - Branding (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-brand-navy relative overflow-hidden flex-col justify-center px-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-slate-900 opacity-90 z-0" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 z-0 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-brand-orange blur-[120px]" />
          <div className="absolute top-[60%] right-[10%] w-[50%] h-[50%] rounded-full bg-brand-lightBlue blur-[100px]" />
        </div>
        
        <div className="relative z-10 space-y-8 animate-fade-in-up">
          <img className="h-20 w-auto object-contain bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl" src="/logo.png" alt="InvoiceFlow" />
          <h1 className="text-5xl font-bold tracking-tight">Invoice smarter, <br/><span className="text-brand-orange">get paid faster.</span></h1>
          <p className="text-lg text-slate-300 max-w-md leading-relaxed">The ultimate modern billing system designed to help you generate beautiful invoices, track payments, and grow your business with ease.</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-[360px] animate-fade-in">
          
          <div className="lg:hidden mb-10 text-center">
            <img className="mx-auto h-20 w-auto object-contain bg-brand-navy p-3 rounded-2xl shadow-lg" src="/logo.png" alt="InvoiceFlow" />
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in to manage your invoices and clients.</p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 mb-4 rounded-r-xl shadow-sm text-sm text-red-700 animate-pulse">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    {...register('email')}
                    type="email"
                    className="modern-input"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium tracking-wide">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('password')}
                    type="password"
                    className="modern-input"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500 font-medium tracking-wide">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="modern-button w-full h-12"
                >
                  {isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
               <span className="text-sm text-slate-500">New to InvoiceFlow?</span>
               <Link to="/register" className="text-sm font-semibold text-brand-orange hover:text-[#e65c00] transition-colors">
                  Create an account
               </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}


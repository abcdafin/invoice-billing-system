import { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../stores/authStore';
import api from '../lib/axios';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      const response = await api.post('/auth/register', data);
      setAuth(response.data.data, response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-orange/30 flex">
      {/* Left side - Branding (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-brand-navy relative overflow-hidden flex-col justify-center px-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy to-slate-900 opacity-90 z-0" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 z-0 pointer-events-none">
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-brand-orange blur-[120px]" />
          <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-lightBlue blur-[100px]" />
        </div>
        
        <div className="relative z-10 space-y-8 animate-fade-in-up">
          <img className="h-20 w-auto object-contain bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl" src="/logo.png" alt="InvoiceFlow" />
          <h1 className="text-5xl font-bold tracking-tight">Join InvoiceFlow,<br/><span className="text-brand-lightBlue">manage seamlessly.</span></h1>
          <p className="text-lg text-slate-300 max-w-md leading-relaxed">Set up your free account in seconds. Create beautiful invoices, manage your clients, and get an aesthetic overview of your financials.</p>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 relative bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-[360px] animate-fade-in">
          
          <div className="lg:hidden mb-10 text-center">
            <img className="mx-auto h-20 w-auto object-contain bg-brand-navy p-3 rounded-2xl shadow-lg" src="/logo.png" alt="InvoiceFlow" />
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
            <p className="mt-2 text-sm text-slate-500">Get started by entering your details.</p>
          </div>

          <div className="mt-10">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 mb-4 rounded-r-xl shadow-sm text-sm text-red-700 animate-pulse">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="modern-input"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium tracking-wide">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email address
                </label>
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Company Name <span className="font-normal text-slate-400">(Optional)</span>
                </label>
                <input
                  {...register('companyName')}
                  type="text"
                  className="modern-input"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
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

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="modern-button w-full h-12"
                >
                  {isSubmitting ? 'Creating account...' : 'Create free account'}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center gap-2">
               <span className="text-sm text-slate-500">Already have an account?</span>
               <Link to="/login" className="text-sm font-semibold text-brand-navy hover:text-slate-700 transition-colors">
                  Sign in
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


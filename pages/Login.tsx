
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { usePharmacy } from '../context/PharmacyContext';
import { Activity, Lock, User, Loader2, X, Mail, ArrowRight, CheckCircle, Shield, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string>(''); // Initialize as empty for placeholder
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'email' | 'code' | 'success'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { login, fontFamily, pharmacyName, registeredUsers } = usePharmacy();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!role) {
      setError('Please select a login role.');
      setIsLoading(false);
      return;
    }

    // Check credentials against registered users and selected role
    const validUser = registeredUsers.find(
      u => u.username === username && u.password === password && u.role === role
    );
    
    if (validUser) {
      // Simulate network request delay - 3000ms
      setTimeout(() => {
        login(validUser);
        navigate('/dashboard');
      }, 3000);
    } else {
      setTimeout(() => {
        setError('Invalid credentials or role. Please try again.');
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    
    setResetLoading(true);
    // Simulate sending email API call
    setTimeout(() => {
      setResetLoading(false);
      setForgotStep('code');
    }, 1500);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode) return;

    setResetLoading(true);
    // Simulate verification API call
    setTimeout(() => {
      setResetLoading(false);
      setForgotStep('success');
    }, 1500);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotStep('email');
    setResetEmail('');
    setResetCode('');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-hover)] flex items-center justify-center p-4 relative ${fontFamily}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--color-border)]`}>
        <div className={`bg-[var(--color-light)] p-8 text-center border-b border-[var(--color-border)]`}>
          <div className={`bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ring-4 ring-[var(--color-border)] overflow-hidden`}>
             <img 
               src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvYjm-f4avjguimXMOIFhYhowYaROPwcuV-kt1SonwfTtZ9Ses1_AYy5g&s=10"
               alt="Logo"
               className="w-full h-full object-cover"
             />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">{pharmacyName}</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200 font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Login As</label>
            <div className="relative">
              <Shield className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none appearance-none font-medium text-slate-700 ${!role ? 'text-slate-400' : ''}`}
                disabled={isLoading}
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="staff">Staff</option>
                <option value="admin">Administrator</option>
              </select>
              <div className="absolute right-3 top-3 pointer-events-none">
                 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none`}
                placeholder="Enter username"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <button 
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-bold text-[var(--color-text)] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none`}
                placeholder="Enter password"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none p-0.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-slate-900 text-[var(--color-primary)] font-bold py-3 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 hover:bg-slate-800 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-2`}
          >
            Sign In
          </button>
          
          <div className="text-center text-xs text-slate-400 mt-4 space-y-1">
            <p>Default Admin: admin / admin123</p>
            <p>Default Staff: staff / staff123</p>
          </div>
        </form>
      </div>

      {/* Loading Modal - Rendered via Portal */}
      {isLoading && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200 w-full max-w-sm mx-auto rounded-xl border-none">
            <Loader2 className={`w-12 h-12 text-[var(--color-hover)] animate-spin mb-4`} />
            <h3 className="text-xl font-extrabold text-slate-800">Signing In</h3>
            <p className="text-slate-500 font-medium mt-1 text-center">Verifying credentials, please wait...</p>
          </div>
        </div>,
        document.body
      )}

      {/* Forgot Password Modal - Rendered via Portal */}
      {showForgotModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-[var(--color-primary)] px-6 py-4 flex justify-between items-center text-slate-900">
               <h3 className="font-extrabold text-lg">
                 {forgotStep === 'email' && 'Forgot Password'}
                 {forgotStep === 'code' && 'Verify Code'}
                 {forgotStep === 'success' && 'Reset Successful'}
               </h3>
               <button onClick={closeForgotModal} className="hover:bg-white/20 p-1 rounded-full"><X size={18} /></button>
            </div>
            
            <div className="p-6">
              {forgotStep === 'email' && (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <p className="text-slate-600 text-sm font-medium">Enter your email address to receive a verification code.</p>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
                      <input 
                        type="email" 
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={resetLoading}
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {resetLoading ? <Loader2 size={18} className="animate-spin" /> : <>Send Code <ArrowRight size={16} /></>}
                  </button>
                </form>
              )}

              {forgotStep === 'code' && (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                   <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-2">
                     Code sent to <span className="font-bold">{resetEmail}</span>
                   </div>
                  <p className="text-slate-600 text-sm font-medium">Please enter the 6-digit code sent to your email.</p>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Verification Code</label>
                    <input 
                      type="text" 
                      required
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)] outline-none bg-white text-center text-2xl tracking-widest font-mono"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={resetLoading}
                    className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {resetLoading ? <Loader2 size={18} className="animate-spin" /> : 'Verify Code'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="w-full text-sm text-slate-500 hover:text-slate-700 font-bold"
                  >
                    Back
                  </button>
                </form>
              )}

              {forgotStep === 'success' && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="font-bold text-xl text-slate-800">Password Reset!</h4>
                  <p className="text-slate-500 text-sm mt-2 mb-6">Your password has been reset successfully. Please check your email for your new temporary password.</p>
                  
                  <button 
                    onClick={closeForgotModal}
                    className="w-full py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-slate-900 font-bold rounded-lg shadow-md transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Login;

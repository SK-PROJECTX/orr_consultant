"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConsultantStore } from '@/store/consultantStore';
import { ChevronLeft, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { GoogleButton } from '@/components/ui/GoogleButton';
import { LanguageToggle } from '@/components/LanguageToggle';

export default function SignInPage() {
  const router = useRouter();
  
  const loginConsultant = useConsultantStore(state => state.loginConsultant);
  const verify2fa = useConsultantStore(state => state.verify2fa);
  const is2faPending = useConsultantStore(state => state.is2faPending);
  const loginError = useConsultantStore(state => state.loginError);
  const isAuthenticated = useConsultantStore(state => state.isAuthenticated);

  // Phase 1: Credentials State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // Phase 2: 2FA Cells State
  const [otpCells, setOtpCells] = useState<string[]>(new Array(6).fill(''));
  const cellRefs = useRef<HTMLInputElement[]>([]);

  // Automatic redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (is2faPending && cellRefs.current[0]) {
      cellRefs.current[0].focus();
    }
  }, [is2faPending]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setTimeout(async () => {
      await loginConsultant(email, password);
      setLoading(false);
    }, 850);
  };

  const handleOtpChange = (value: string, index: number) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const updated = [...otpCells];
      updated[index] = '';
      setOtpCells(updated);
      return;
    }

    const singleDigit = cleaned.substring(cleaned.length - 1);
    const updated = [...otpCells];
    updated[index] = singleDigit;
    setOtpCells(updated);

    if (index < 5 && cellRefs.current[index + 1]) {
      cellRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otpCells[index] && index > 0 && cellRefs.current[index - 1]) {
        cellRefs.current[index - 1].focus();
      } else {
        const updated = [...otpCells];
        updated[index] = '';
        setOtpCells(updated);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pasted.length >= 6) {
      const cells = pasted.substring(0, 6).split('');
      setOtpCells(cells);
      if (cellRefs.current[5]) {
        cellRefs.current[5].focus();
      }
    }
  };

  const handleVerify2fa = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCells.join('');
    if (code.length < 6) return;

    setLoading(true);
    setTimeout(() => {
      const success = verify2fa(code);
      setLoading(false);
      if (!success) {
        setOtpCells(new Array(6).fill(''));
        if (cellRefs.current[0]) {
          cellRefs.current[0].focus();
        }
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-white select-none">

      {/* LEFT SIDE - Exact image cover + logo + taglines matching reference */}
      <div
        className="hidden md:flex flex-1 bg-cover m-3 rounded-lg bg-center relative text-white flex-col justify-between"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/depeqzb6z/image/upload/v1764168892/side-image_1_jwpnup.png')",
        }}
      >
        {/* Top logo & back to homepage header */}
        <div className="justify-between flex flex-row w-full relative z-10">
          <div className="justify-start flex items-start">
            <Link href="/">
              <img
                src="https://res.cloudinary.com/depeqzb6z/image/upload/v1764395173/logo_qqpk6j.svg"
                alt="ORR Solutions Logo"
                className="w-32 h-32 mt-5 ml-10 cursor-pointer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </Link>
          </div>
        </div>

        {/* Tagline block at the bottom */}
        <div className="absolute bottom-10 w-full px-6 text-start relative z-10">
          <p className="font-poppins font-extrabold text-[32px] md:text-[48px] lg:text-[48px] xl:text-[40px] ml-5 mx-auto leading-tight">
            <span className="text-[#86FF22]">ORR Solutions</span>  <br />
            Listen.  Solve. Optimise.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Authentication Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-16 py-12 relative overflow-hidden">
        {/* Soft atmospheric background lights */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl w-full relative z-10">

          {/* Mobile logo (hidden on desktop) */}
          <div className="flex md:hidden flex-col items-center justify-center mb-8">
            <Link href="/">
              <img
                src="https://res.cloudinary.com/depeqzb6z/image/upload/v1764395173/logo_qqpk6j.svg"
                alt="ORR Solutions Logo"
                className="w-16 h-16 mb-4"
              />
            </Link>
          </div>

          {/* Form Header panel */}
          <div className="flex justify-between items-center mb-6">
            <div className="mt-0 text-left">
              {!is2faPending ? (
                <>
                  <h2 className="text-2xl font-extrabold mb-2 md:text-start text-[#FFFFFF]">
                    Welcome <span className="text-[#61FD51]">Back</span>
                  </h2>
                  <p className="text-sm font-medium mb-10 text-[#FFFFFF] md:text-start">
                    Sign in with your verified specialist account to view operational scopes.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold mb-2 md:text-start text-[#FFFFFF] flex items-center gap-1.5">
                    <ShieldCheck className="text-[#61FD51]" size={26} />
                    Verify <span className="text-[#61FD51]">Identity</span>
                  </h2>
                  <p className="text-sm font-medium mb-10 text-[#FFFFFF] md:text-start">
                    Enter the 6-digit passcode sent to your specialist authenticator device.
                  </p>
                </>
              )}
            </div>

            {/* Language & Theme toggles matching position and size */}
            <div className="mb-8 flex items-center gap-4">
              <LanguageToggle />
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                🌙
              </div>
            </div>
          </div>

          {/* Error notifications */}
          {loginError && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold flex gap-2.5 items-start">
              <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <strong className="block text-red-400 uppercase tracking-wider text-[9px] font-mono">Gateway Warning</strong>
                <span>{loginError}</span>
              </div>
            </div>
          )}

          {/* PHASE 1: Credentials Form */}
          {!is2faPending ? (
            <form className="space-y-7" onSubmit={handleCredentialsSubmit}>

              {/* Email Entry */}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border-b border-gray-300 px-6 py-5 focus:outline-none text-white bg-transparent transition-colors focus:border-[#61FD51]"
                required
              />

              {/* Password Entry */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border-b border-gray-300 px-6 py-5 focus:outline-none text-white bg-transparent transition-colors focus:border-[#61FD51]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>

              {/* Remember checkbox & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <label className="inline-flex items-center text-sm text-white cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-[#61FD51] bg-transparent border-gray-300 rounded focus:ring-0 mr-2 cursor-pointer"
                  />
                  <span className="ml-2 font-poppins">Remember Me</span>
                </label>

                <div className="hidden md:flex items-center">
                  <Link
                    href="/forgot-password"
                    className="px-6 font-extrabold underline text-md text-[#61FD51] hover:text-[#52d743] transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#13BE77] hover:bg-[#11aa6a] py-5 rounded-lg cursor-pointer mt-4 transition disabled:opacity-50 text-white font-regular shadow-lg shadow-[#13BE77]/10 active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Login'
                )}
              </button>

              {/* Register footer link */}
              <div className="hidden md:flex items-end justify-end mt-4">
                <Link
                  href="/register"
                  className="px-6 font-extrabold text-md text-[#FFFFFF]"
                >
                  New here? <span className="text-[#61FD51] underline">Register</span>
                </Link>
              </div>
            </form>
          ) : (
            /* PHASE 2: 2FA Authentication code verification pad */
            <form className="space-y-7 animate-in fade-in duration-300" onSubmit={handleVerify2fa}>

              {/* OTP Input row */}
              <div className="flex gap-3.5 justify-center py-4">
                {otpCells.map((val, idx) => (
                  <input
                    key={idx}
                    ref={el => { if (el) cellRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={e => handleOtpChange(e.target.value, idx)}
                    onKeyDown={e => handleOtpKeyDown(e, idx)}
                    onPaste={idx === 0 ? handleOtpPaste : undefined}
                    className="w-12 h-14 bg-white/5 border border-gray-300 focus:border-[#61FD51] rounded-xl text-center text-lg font-black text-white focus:outline-none transition-all font-mono"
                    required
                  />
                ))}
              </div>

              {/* Secure reminder block */}
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-xl space-y-1 text-left font-mono text-[10px] text-slate-400 leading-normal">
                <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">SMS Authentication Simulator</div>
                Verification passcode generated: <strong className="text-[#61FD51]">123456</strong> or <strong className="text-[#61FD51]">888888</strong>.
              </div>

              {/* Verify OTP submit CTA button */}
              <button
                type="submit"
                disabled={loading || otpCells.join('').length < 6}
                className="w-full bg-[#13BE77] hover:bg-[#11aa6a] py-5 rounded-lg cursor-pointer mt-4 transition disabled:opacity-50 text-slate-950 font-black shadow-lg shadow-[#13BE77]/10 active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  'Verify Security Code'
                )}
              </button>

              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <button
                  type="button"
                  onClick={() => useConsultantStore.setState({ is2faPending: false, loginError: null })}
                  className="hover:text-white cursor-pointer transition font-mono"
                >
                  Change credentials
                </button>
                <span>Gateway Nodes Active</span>
              </div>
            </form>
          )}

          {/* Bottom custom divider & Google authentication matches reference */}
          <div className="mt-8">
            {/* Custom Separator divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full h-[1px] bg-gray-300/20" />
              <span className="relative px-4 text-xs font-black uppercase text-gray-500 bg-background tracking-widest font-mono">
                OR
              </span>
            </div>

            {/* Custom Google authentication Button */}
            <div className="mt-6">
              <GoogleButton
                onClick={() => alert("Google OAuth2 authentication simulation triggered for consultant account validation.")}
                isLoading={false}
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

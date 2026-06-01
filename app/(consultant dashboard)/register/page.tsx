"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { LanguageToggle } from "@/components/LanguageToggle";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);
    // Simulate secure consultant registry verification delay
    setTimeout(() => {
      setIsLoading(false);
      alert("Consultant Account Registered successfully! Redirecting to specialist gateway for 2FA verification.");
      router.push("/signin");
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-white select-none">

      {/* LEFT SIDE - Form Pane matching client specifications */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-16 py-12 relative overflow-hidden">
        {/* Soft atmospheric background lights */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl w-full relative z-10 animate-in fade-in duration-300">

          {/* Mobile Top Header (hidden on desktop) */}
          <div className="flex md:hidden flex-col items-center justify-center mb-8">
            <Link href="/">
              <img
                src="https://res.cloudinary.com/depeqzb6z/image/upload/v1764395173/logo_qqpk6j.svg"
                alt="ORR Solutions Logo"
                className="w-16 h-16 mb-4"
              />
            </Link>
          </div>

          {/* Form Header block */}
          <div className="flex justify-between items-center mb-6">
            <div className="mt-0 text-left">
              <h2 className="text-2xl font-extrabold mb-2 md:text-start text-[#FFFFFF]">
                Join ORR <span className="text-[#61FD51]">Solutions</span>
              </h2>
              <p className="text-sm font-medium mb-10 text-[#FFFFFF] md:text-start">
                Register a specialist partner account to view operational scopes.
              </p>
            </div>

            {/* Language & Theme toggles placeholders matching position and size */}
            <div className="mb-8 flex items-center gap-4">
              <LanguageToggle />
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                🌙
              </div>
            </div>
          </div>

          {/* Error notifications */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold flex gap-2.5 items-start">
              <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <strong className="block text-red-400 uppercase tracking-wider text-[9px] font-mono">Register Warning</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form className="space-y-7" onSubmit={handleSubmit}>

            {/* First Name Entry */}
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full border-b border-gray-300 px-6 py-5 focus:outline-none text-white bg-transparent transition-colors focus:border-[#61FD51]"
              required
            />

            {/* Last Name Entry */}
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full border-b border-gray-300 px-6 py-5 focus:outline-none text-white bg-transparent transition-colors focus:border-[#61FD51]"
              required
            />

            {/* Email Entry */}
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full border-b border-gray-300 px-6 py-5 focus:outline-none text-white bg-transparent transition-colors focus:border-[#61FD51]"
              required
            />

            {/* Password Entry */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
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

            {/* Confirm Password Entry */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full border-b border-gray-300 px-6 py-5 focus:outline-none text-white bg-transparent transition-colors focus:border-[#61FD51]"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#13BE77] hover:bg-[#11aa6a] py-5 rounded-lg cursor-pointer mt-4 transition disabled:opacity-50 text-white font-regular shadow-lg shadow-[#13BE77]/10 active:scale-[0.99]"
            >
              {isLoading ? "Signing Up..." : "Register"}
            </button>

            {/* Incompatible Passwords alert */}
            {formData.password !== formData.confirmPassword && formData.confirmPassword && (
              <p className="text-red-400 text-xs font-semibold mt-2">Passwords do not match.</p>
            )}

            {/* Login footer link */}
            <div className="hidden md:flex items-end justify-end mt-4">
              <Link
                href="/signin"
                className="px-6 font-extrabold text-md text-[#FFFFFF]"
              >
                Already have an account? <span className="text-[#61FD51] underline">Login</span>
              </Link>
            </div>

          </form>

          {/* Separator & Google OAuth matches login */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full h-[1px] bg-gray-300/20" />
              <span className="relative px-4 text-xs font-black uppercase text-gray-500 bg-background tracking-widest font-mono">
                OR
              </span>
            </div>

            <div className="mt-6">
              <GoogleButton
                onClick={() => alert("Google OAuth2 registration simulation triggered for specialist account validation.")}
                text="Continue with Google"
                isLoading={false}
              />
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - Large Cover Image + Tagline (Inverted to mirror login layout) */}
      <div
        className="hidden md:flex flex-1 bg-cover m-3 rounded-lg bg-center relative text-white flex-col justify-between"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/depeqzb6z/image/upload/v1764168892/side-image_1_jwpnup.png')",
        }}
      >
        {/* Soft glass overlay */}
        <div className="absolute inset-0 bg-slate-950/10 pointer-events-none" />

        {/* Top items */}
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
          {/* 
          <div className="px-10 mt-18 flex flex-row item-center justify-center text-center items-center gap-1">
            <ChevronLeft className="my-0 text-white" size={16} />
            <Link href="/" className="text-sm font-poppins font-regular hover:underline">
              Back to Homepage
            </Link>
          </div> */}
        </div>

        {/* Tagline block at the bottom */}
        <div className="absolute bottom-10 w-full px-6 text-start relative z-10">
          <p className="font-poppins font-extrabold text-[32px] md:text-[48px] lg:text-[48px] xl:text-[40px] ml-5 mx-auto leading-tight">
            <span className="text-[#86FF22]">ORR Solutions</span>  <br />
            Listen.  Solve. Optimise.
          </p>
        </div>
      </div>

    </div>
  );
}

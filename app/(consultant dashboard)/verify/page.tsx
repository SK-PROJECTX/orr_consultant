"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useConsultantStore } from "@/store/consultantStore";

export default function VerifyPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [consultantNumber, setConsultantNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    // Retrieve email from session storage passed from register page
    const storedEmail = sessionStorage.getItem("verify_email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const verifyConsultant = useConsultantStore(state => state.verifyConsultant);
  const resend2fa = useConsultantStore(state => state.resend2fa);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consultantNumber) {
      setError("Please enter your Consultant Number.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await verifyConsultant(email, consultantNumber);

      if (response.success) {
        alert("Verification successful! You can now access the portal.");
        // Clear session storage
        sessionStorage.removeItem("verify_email");
        router.push("/signin");
      } else {
        setError(response.message || "Verification failed. Please check your number.");
      }
    } catch (err) {
      setError("Network error. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-white select-none">
      {/* LEFT SIDE - Form Pane */}
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
                Email <span className="text-[#61FD51]">Verification</span>
              </h2>
              <p className="text-sm font-medium mb-10 text-[#FFFFFF] md:text-start">
                Enter the Consultant Number provided in your verification email.
              </p>
            </div>

            <div className="mb-8 flex items-center gap-4">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>

          {/* Error notifications */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-semibold flex gap-2.5 items-start">
              <AlertTriangle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
              <div className="space-y-0.5">
                <strong className="block text-red-400 uppercase tracking-wider text-[9px] font-mono">Verification Warning</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Verification Form */}
          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* Email Entry (Read Only if passed, editable otherwise) */}
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 px-6 py-5 focus:outline-none text-white bg-transparent transition-colors focus:border-[#61FD51]"
              required
            />

            {/* Consultant Number Entry */}
            <div className="relative">
              <input
                type="text"
                placeholder="Consultant Number (e.g. ORR-CONS-000001)"
                value={consultantNumber}
                onChange={e => setConsultantNumber(e.target.value)}
                className="w-full border-b border-gray-300 px-6 py-5 focus:outline-none text-white bg-transparent transition-colors focus:border-[#61FD51]"
                required
              />
              <Key className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#13BE77] hover:bg-[#11aa6a] py-5 rounded-lg cursor-pointer mt-4 transition disabled:opacity-50 text-white font-regular shadow-lg shadow-[#13BE77]/10 active:scale-[0.99]"
            >
              {isLoading ? "Verifying..." : "Verify Consultant Profile"}
            </button>

            <div className="flex justify-between items-center text-xs font-bold text-slate-500 pt-2">
              <Link href="/signin" className="hover:text-white transition font-mono">
                Back to Sign In
              </Link>
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError("Please enter your email to resend the code.");
                    return;
                  }
                  setIsResending(true);
                  const res = await resend2fa(email);
                  setIsResending(false);
                  if (res) {
                    setError(null);
                    alert("A new verification code has been dispatched to your email.");
                  }
                }}
                disabled={isResending}
                className="text-[#61FD51] hover:underline cursor-pointer transition font-mono disabled:opacity-50"
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - Large Cover Image + Tagline (Inverted to mirror layout) */}
      <div
        className="hidden md:flex flex-1 bg-cover m-3 rounded-lg bg-center relative text-white flex-col justify-between"
        style={{
          backgroundImage: "url('https://res.cloudinary.com/depeqzb6z/image/upload/v1764168892/side-image_1_jwpnup.png')",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/10 pointer-events-none" />

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

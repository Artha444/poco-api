"use client";

import { useActionState } from "react";
import { registerAccount } from "@/app/actions/auth";
import { Lock, User, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAccount, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0E14] text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="w-full max-w-md p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20"
          >
            <ShieldCheck size={32} className="text-black" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-400">Join POCO POS System</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                name="username"
                required
                minLength={3}
                className="block w-full pl-11 pr-4 py-3.5 border border-white/10 rounded-2xl bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all hover:bg-black/60"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="block w-full pl-11 pr-4 py-3.5 border border-white/10 rounded-2xl bg-black/40 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all hover:bg-black/60"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select 
              name="role" 
              className="block w-full px-4 py-3.5 border border-white/10 rounded-2xl bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all hover:bg-black/60 cursor-pointer appearance-none"
            >
              <option value="CASHIER">Cashier (Staff)</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          {state?.error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">
              {state.error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-[#0B0E14] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Already have an account? <Link href="/login" className="text-yellow-400 hover:text-yellow-300 font-bold hover:underline transition-all">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}

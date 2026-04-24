"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Zap, Shield, Battery, Star } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-white overflow-hidden selection:bg-yellow-500 selection:text-black">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                POCO
              </span>
            </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
              <a href="#products" className="hover:text-yellow-400 transition-colors">Products</a>
              <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
              <a href="#testimonials" className="hover:text-yellow-400 transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-sm font-semibold transition-all hover:scale-105 active:scale-95">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            src="/video/poco.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#0B0E14] via-black/40 to-transparent"></div>
        </div>

        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-yellow-500/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-block mb-6 px-4 py-1.5 rounded-full border border-yellow-500/50 bg-black/50 backdrop-blur-md text-yellow-400 text-sm font-semibold tracking-wide uppercase"
            >
              The Origin of Speed
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight drop-shadow-2xl"
            >
              Unleash the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Beast</span> Within.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto drop-shadow-lg"
            >
              Experience next-level performance with POCO's latest lineup. Designed for gamers, creators, and power users who demand the absolute best.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a href="#products" className="group px-8 py-4 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_-5px_rgba(234,179,8,0.5)]">
                Explore Products
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <Link href="/login" className="px-8 py-4 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 border border-white/20 text-white font-bold flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl">
                Go to POS System
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Phone Mockup Effect */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring" }}
          className="mt-20 flex justify-center relative z-10 w-full"
        >
          <div className="relative w-full max-w-3xl aspect-video rounded-[2rem] overflow-hidden border border-white/20 shadow-2xl mx-4 group backdrop-blur-sm bg-black/30">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-black/80 flex items-center justify-center">
              <span className="text-white/10 font-black text-6xl md:text-9xl rotate-[-10deg] group-hover:scale-110 transition-transform duration-700">POCO F5</span>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=1200" 
              alt="POCO Phone" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:opacity-90 transition-opacity duration-700"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-black/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4">Why Choose POCO?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">We don't compromise. Every POCO device is built with a singular focus on raw performance and extreme value.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: Zap, title: "Snapdragon® Power", desc: "Equipped with flagship processors to handle intense gaming and heavy multitasking with ease." },
              { icon: Battery, title: "All-Day Battery", desc: "Massive battery capacity with hyper-fast charging. Never run out of juice when you need it most." },
              { icon: Shield, title: "LiquidCool Technology", desc: "Advanced cooling systems keep your device running at peak performance without thermal throttling." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-yellow-500/30 hover:bg-white/10 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-6 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="products" className="py-24 relative">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={fadeInUp}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Latest Arsenal</h2>
              <p className="text-gray-400 text-lg">Discover the perfect device for your needs.</p>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { name: "POCO F5 Pro", price: "Rp 6.999.000", specs: ["Snapdragon 8+ Gen 1", "WQHD+ 120Hz AMOLED", "67W Turbo Charge"], img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=500" },
              { name: "POCO X5 Pro 5G", price: "Rp 3.999.000", specs: ["Snapdragon 778G", "120Hz FHD+ AMOLED", "108MP Pro-grade camera"], img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=500" },
              { name: "POCO M5", price: "Rp 2.199.000", specs: ["MediaTek Helio G99", "90Hz FHD+ DynamicSwitch", "5000mAh Battery"], img: "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&q=80&w=500" }
            ].map((product, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="group rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-yellow-500/50 transition-all flex flex-col"
              >
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay"></div>
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{product.name}</h3>
                    <span className="text-yellow-400 font-semibold">{product.price}</span>
                  </div>
                  <ul className="space-y-2 mb-8 flex-1">
                    {product.specs.map((spec, j) => (
                      <li key={j} className="text-sm text-gray-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-yellow-500 hover:text-black font-semibold transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart size={18} />
                    Buy Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="initial"
            whileInView="whileInView"
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Community Speaks</h2>
            <p className="text-gray-400 text-lg">Hear from the true fans who push limits.</p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {[
              { name: "Alex R.", role: "Pro Gamer", content: "The F5 Pro is absolutely insane. Playing Genshin at max settings 60fps without the phone turning into a frying pan. Pure magic." },
              { name: "Sarah M.", role: "Tech Reviewer", content: "POCO continues to disrupt the market. You're getting flagship specs for half the price. It's truly the king of value." }
            ].map((t, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                className="p-8 rounded-3xl bg-white/5 border border-white/10"
              >
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[1,2,3,4,5].map(star => <Star key={star} size={18} fill="currentColor" />)}
                </div>
                <p className="text-lg text-gray-300 italic mb-6">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-yellow-600"></div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <span className="text-sm text-gray-500">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 bg-black">
        <p>© 2026 POCO Global. All rights reserved.</p>
      </footer>
    </div>
  );
}

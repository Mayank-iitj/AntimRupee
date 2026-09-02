import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Users, Target, Shield, Heart } from 'lucide-react';

const GlowCard = ({ children, className }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div className={`relative group ${className}`} onMouseMove={handleMouseMove}>
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(117, 132, 214, 0.15), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export default function AboutUs() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen relative z-10">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="max-w-4xl mx-auto text-center mb-20">
        <div className="uppercase tracking-[0.2em] text-xs font-bold text-primary mb-4">OUR MISSION</div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6 tracking-tight">Nobody left behind.</h1>
        <p className="text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
          Antim Rupee was born from a simple observation: millions of rupees in welfare payments bounce every month due to trivial data mismatches. We exist to catch those failures and unblock the flow of funds to those who need it most.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <GlowCard className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
          <Target className="text-primary mb-6" size={40} />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Precision Engineering</h3>
          <p className="text-gray-600">We don't rely on guesswork. Our clustering algorithms analyze millions of FTO traces to find deterministic patterns in bank rejections.</p>
        </GlowCard>
        
        <GlowCard className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm">
          <Shield className="text-primary mb-6" size={40} />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Privacy by Design</h3>
          <p className="text-gray-600">Operating strictly within DPI guidelines, our engines anonymize PII at the ingestion layer. Analysts only see actionable metadata.</p>
        </GlowCard>

        <GlowCard className="bg-white border border-gray-100 p-10 rounded-3xl shadow-sm md:col-span-2 text-center flex flex-col items-center">
          <Heart className="text-red-400 mb-6" size={40} />
          <h3 className="text-2xl font-bold text-gray-900 mb-4 max-w-md">Empathy at Scale</h3>
          <p className="text-gray-600 max-w-2xl">Behind every failed transaction is a citizen waiting for their rightful wages. Our technology scales to the size of India, but our focus remains on the individual.</p>
        </GlowCard>
      </div>
    </div>
  );
}

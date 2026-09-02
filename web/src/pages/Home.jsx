import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Database, Activity, Layers, Link as LinkIcon, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LogoLoop from '../components/LogoLoop';

import InfiniteSpiral from '../components/InfiniteSpiral';
import ScrollVelocity from '../components/ScrollVelocity';

// 1. KPI Count-Up
const CountUp = ({ to, duration = 2 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = to / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [to, duration]);
  return <span>{count.toLocaleString()}</span>;
};

// 2. Magnetic Button Component
const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;
  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// 3. Glow Card Component (Cursor Tracking Spotlight)
const GlowCard = ({ children, className }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(117, 132, 214, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
};

// 4. Word-by-Word Text Reveal
const TextReveal = ({ text, className }) => {
  const words = text.split(" ");
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
    }),
  };
  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 12, stiffness: 100 },
    },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <motion.h1 variants={container} initial="hidden" animate="visible" className={className}>
      {words.map((word, index) => (
        word === "||PILL||" ? (
          <motion.span variants={child} key={index} className="inline-flex items-center justify-center border-2 border-gray-200 rounded-full px-6 py-2 mx-2 bg-white/50 backdrop-blur-md text-gray-900 shadow-sm relative -top-1">
            {text.includes("अंतिम") ? "विफल भुगतान" : "Failed Payments"}
          </motion.span>
        ) : word === "||BR||" ? (
          <br key={index} className="hidden md:block" />
        ) : (
          <motion.span variants={child} key={index} style={{ display: 'inline-block', marginRight: '0.25em' }}>
            {word === "Unblock" ? word : word === "Final" || word === "Mile." ? word : word}
          </motion.span>
        )
      ))}
    </motion.h1>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-600 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const { scrollY } = useScroll();
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  // Parallax effects for dashboard
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const dashboardY = useTransform(scrollY, [0, 800], [100, -50]);
  const dashboardRotateX = useTransform(scrollY, [0, 800], [20, 0]);
  const dashboardScale = useTransform(scrollY, [0, 800], [0.95, 1]);

  // SVG Drawing path for "How it Works"
  const { scrollYProgress: lineProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  // Interactive 3D tilt state for Dashboard
  const dashRef = useRef(null);
  const dashX = useMotionValue(0);
  const dashY = useMotionValue(0);
  const rotateDashX = useTransform(dashY, [-200, 200], [5, -5]);
  const rotateDashY = useTransform(dashX, [-200, 200], [-5, 5]);

  function handleDashHover(e) {
    if(!dashRef.current) return;
    const rect = dashRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    dashX.set(x);
    dashY.set(y);
  }

  function handleDashLeave() {
    dashX.set(0);
    dashY.set(0);
  }

  const handleLaunchDashboard = () => {
    navigate('/dashboard');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <main id="features" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <motion.div style={{ y: heroY }} className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            
            <motion.div initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{duration: 0.5}} className="uppercase tracking-[0.2em] text-xs font-bold text-gray-500 mb-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-gray-300"></span> Governance / DPI <span className="w-8 h-[1px] bg-gray-300"></span>
            </motion.div>

            <TextReveal 
              text={lang === 'hi' ? "अंतिम मील पर ||PILL|| ||BR|| अनब्लॉक करें।" : "Unblock ||PILL|| ||BR|| at the Last Mile."}
              className="text-5xl lg:text-7xl font-display font-bold text-gray-900 tracking-tight leading-[1.15] mb-8"
            />

            <motion.p initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.6, duration: 0.8}} className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              {lang === 'hi' ? "हम नागरिकों को सुरक्षा जाल से बाहर होने से बचाने के लिए डीबीटी विफलताओं का पता लगाने, उन्हें सामान्य बनाने और हल करने के लिए कच्चे लेनदेन के निशानों को संसाधित करते हैं।" : "We process raw transaction traces to detect, normalize, and resolve systemic DBT failures—preventing citizens from dropping out of the safety net."}
            </motion.p>

            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.8}} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <MagneticButton onClick={handleLaunchDashboard} className="w-full sm:w-auto px-8 py-4 bg-primary rounded-full text-white font-semibold transition-colors shadow-lg flex items-center justify-center gap-2 group hover:shadow-[0_20px_25px_-5px_rgba(117,132,214,0.4)]">
                {lang === 'hi' 
                  ? (isAuthenticated ? "डैशबोर्ड दर्ज करें" : "डैशबोर्ड लॉन्च करें") 
                  : (isAuthenticated ? "Enter Dashboard" : "Sign In to Launch")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
              <MagneticButton onClick={() => scrollToSection('how-it-works')} className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 rounded-full text-gray-700 font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors hover:bg-gray-50">
                {lang === 'hi' ? "यह कैसे काम करता है" : "How it Works"}
              </MagneticButton>
            </motion.div>
            
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 1.2}} className="mt-8 text-sm text-gray-500 font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" /> ₹<span className="text-primary font-bold"><CountUp to={4234} duration={2}/></span> Cr in stalled MNREGA wages unblocked this month
            </motion.div>
          </div>
        </motion.div>

        {/* Interactive 3D Parallax Dashboard */}
        <motion.div 
          ref={dashRef}
          onMouseMove={handleDashHover}
          onMouseLeave={handleDashLeave}
          style={{ 
            y: dashboardY, 
            rotateX: dashX.get() ? rotateDashX : dashboardRotateX, 
            rotateY: rotateDashY,
            scale: dashboardScale, 
            perspective: 1200 
          }}
          className="max-w-6xl mx-auto px-6 mt-20"
        >
          <motion.div 
            whileHover={{ boxShadow: "0 40px 80px -12px rgba(0, 0, 0, 0.2)" }}
            className="rounded-2xl border border-white/60 bg-white/40 p-2 backdrop-blur-xl shadow-2xl relative overflow-hidden group cursor-pointer transition-shadow duration-500"
            onClick={handleLaunchDashboard}
          >
            <div className="h-10 border-b border-gray-100 flex items-center px-4 gap-2 bg-white/90 rounded-t-xl">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
            </div>
            
            <div className="h-[500px] bg-gray-50/90 rounded-b-xl overflow-hidden flex items-start justify-center">
              <img 
                src="/app-preview.png" 
                alt="Action Queue Preview" 
                className="w-full h-full object-cover object-top"
                draggable={false}
              />
            </div>

            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/30 backdrop-blur-[2px]">
              <motion.span 
                initial={{ scale: 0.9, y: 10 }}
                whileInView={{ scale: 1, y: 0 }}
                className="px-8 py-4 bg-gray-900 rounded-full text-white font-medium shadow-2xl flex items-center gap-2"
              >
                Open Live App <ArrowRight size={16} />
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* How it Works - 4 Step Sequence with SVG Path & GlowCards */}
      <section id="how-it-works" className="py-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6 relative">
          
          {/* Removed SVG Connecting Path on user request */}

          <div className="text-center mb-20 relative z-10">
            <div className="uppercase tracking-[0.2em] text-xs font-bold text-gray-500 mb-4">HOW IT WORKS</div>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Explore Our Simple, Easy Process</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {[
              { step: 1, icon: Database, title: "Data Ingestion", desc: "Raw FTO traces and failure logs are securely pulled from the state MIS." },
              { step: 2, icon: Activity, title: "Normalization", desc: "Messy, bank-specific rejection strings are parsed into standardized causes." },
              { step: 3, icon: Layers, title: "Clustering", desc: "Failures are grouped by geography and root cause to find systemic anomalies." },
              { step: 4, icon: Zap, title: "Resolution", desc: "State agents receive prioritized action queues to unblock payments." }
            ].map((item, i) => (
              <motion.div 
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlowCard className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 relative z-10">
                    Step {item.step}
                  </div>
                  <item.icon className="text-secondary mb-6 stroke-[1.5] relative z-10" size={36} />
                  <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm relative z-10">{item.desc}</p>
                </GlowCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center relative z-10">
            <MagneticButton onClick={handleLaunchDashboard} className="px-8 py-4 bg-gray-900 rounded-full text-white font-medium shadow-xl inline-flex items-center gap-2">
              Connect Now <ArrowRight size={18} />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* Impact Gallery - InfiniteSpiral */}
      <section className="py-24 relative z-20 overflow-hidden bg-gray-900 text-white">
        <div className="text-center mb-16 relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-display font-bold mb-4">Real Faces, Real Impact</h2>
          <p className="text-white/70">A glimpse at the communities we serve across the districts.</p>
        </div>
        <div style={{ height: '600px', position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
          <InfiniteSpiral
            items={Array.from({ length: 28 }, (_, i) => `https://picsum.photos/seed/${i + 1}/400/400`)}
            animationMode="all"
            speed={0.55}
            radius={220}
            cardWidth={180}
            cardHeight={240}
            verticalSpacing={80}
            perspective={1000}
            cardRadius={20}
            centerScale={1.3}
            edgeBlur={4}
            cardsPerTurn={7}
            pauseOnHover
          />
        </div>
      </section>


      
      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6"><div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" /></div>

      {/* Integrations Section */}
      <section id="integrations" className="py-24 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <div className="uppercase tracking-[0.2em] text-xs font-bold text-gray-500 mb-4">INTEGRATIONS</div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-primary to-gray-900 mb-6 leading-tight pb-2">
            Powerful Integrations<br/>Made Simple
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Connect directly to government databases and banking endpoints without writing a single line of custom code.</p>
        </div>
        
        {/* Infinite Marquee using LogoLoop */}
        <div className="py-8 w-full max-w-7xl mx-auto overflow-hidden relative opacity-90">
          <LogoLoop
            logos={[
              { 
                title: "PFMS",
                node: <div className="flex items-center justify-center w-32 h-24 rounded-3xl bg-white shadow-sm border border-gray-100/50 text-gray-800 font-bold text-xl hover:text-primary transition-colors hover:shadow-md hover:-translate-y-1">PFMS</div>
              },
              {
                title: "NPCI",
                node: <div className="flex items-center justify-center w-32 h-24 rounded-3xl bg-white shadow-sm border border-gray-100/50 text-gray-800 font-bold text-xl hover:text-[#7584D6] transition-colors hover:shadow-md hover:-translate-y-1">NPCI</div>
              },
              {
                title: "UIDAI",
                node: <div className="flex items-center justify-center w-32 h-24 rounded-3xl bg-white shadow-sm border border-gray-100/50 text-gray-800 font-bold text-xl hover:text-[#aa3bff] transition-colors hover:shadow-md hover:-translate-y-1">UIDAI</div>
              },
              {
                title: "DBT Bharat",
                node: <div className="flex items-center justify-center w-32 h-24 rounded-3xl bg-white shadow-sm border border-gray-100/50 text-gray-800 font-bold text-xl hover:text-green-500 transition-colors hover:shadow-md hover:-translate-y-1">DBT Bharat</div>
              },
              { 
                title: "NIC",
                node: <div className="flex items-center justify-center w-32 h-24 rounded-3xl bg-white shadow-sm border border-gray-100/50 text-gray-800 font-bold text-xl hover:text-primary transition-colors hover:shadow-md hover:-translate-y-1">NIC</div>
              },
              {
                title: "SBI",
                node: <div className="flex items-center justify-center w-32 h-24 rounded-3xl bg-white shadow-sm border border-gray-100/50 text-gray-800 font-bold text-xl hover:text-[#7584D6] transition-colors hover:shadow-md hover:-translate-y-1">SBI DB</div>
              },
            ]}
            speed={60}
            direction="left"
            logoHeight={96}
            gap={64}
            hoverSpeed={10}
            fadeOut
            fadeOutColor="#ffffff"
            scaleOnHover
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 relative z-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">Burning Questions About Antim Rupee</h2>
            <p className="text-gray-500">Simple answers to make things clear.</p>
          </div>
          
          <div className="border-t border-gray-200">
            <FAQItem question="How do you detect silent exclusions?" answer="We monitor the delta between marked 'completed work' in the MIS and actual cleared FTO (Fund Transfer Orders). If a worker's payment bounces repeatedly, they drop off the active ledger—we flag this void." />
            <FAQItem question="Does this require PII?" answer="No. The core FDR Clustering algorithm operates entirely on anonymized metadata. PII is only exposed in the secure 'Trace View' for authorized agents." />
            <FAQItem question="Can this integrate with existing state dashboards?" answer="Yes. Antim Rupee is built as an API-first engine. The frontend provided here is just a reference implementation." />
            <FAQItem question="Is the platform suitable for beginners?" answer="Absolutely. The Action Queue translates cryptic bank errors into plain-english instructions like 'Call Branch Manager'." />
          </div>
        </div>
      </section>

      {/* ScrollVelocity Banner */}
      <section className="py-20 bg-gray-50 overflow-hidden text-[#7e8ddd] opacity-60">
        <ScrollVelocity
          texts={['EMPOWERING STATES • UNBLOCKING DBT •', 'ANTIM RUPEE • LAST MILE FINANCE •']} 
          velocity={60} 
          className="font-display font-bold tracking-tight"
        />
      </section>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Viewer from './Viewer';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { ShoppingCart, Shield, Zap, Box, ArrowLeft, ArrowRight } from 'lucide-react';

export default function App() {
  const containerRef = useRef(null);
  const [currentCubeIndex, setCurrentCubeIndex] = useState(0);
  const [showRubiksCube, setShowRubiksCube] = useState(false);
  
  const cubeData = [
    {
      type: '2x2 Pocket',
      size: 2,
      tagline: 'Compact & Fast',
      price: '$14.99',
      specs: [
        { icon: <Zap size={18} />, title: 'Corner Cutting', desc: 'Superior 45-degree turns.' },
        { icon: <Shield size={18} />, title: 'Solid Core', desc: 'Durable internal mechanism.' },
        { icon: <Box size={18} />, title: 'Travel Size', desc: 'Fits in any pocket.' },
      ],
      description: 'The perfect entry-level cube or travel companion. Small in size but big on performance.'
    },
    {
      type: '3x3 Professional',
      size: 3,
      tagline: 'The Speedcubing Standard',
      price: '$24.99',
      specs: [
        { icon: <Zap size={18} />, title: 'Magnetic Core', desc: 'Self-aligning layers.' },
        { icon: <Shield size={18} />, title: 'UV Coated', desc: 'Scratch-resistant finish.' },
        { icon: <Box size={18} />, title: 'Dual Adjustment', desc: '9 levels of tension.' },
      ],
      description: 'The flagship 3x3 designed for world-record attempts. Perfect balance of speed and stability.'
    },
    {
      type: '4x4 Master',
      size: 4,
      tagline: 'Complex Engineering',
      price: '$34.99',
      specs: [
        { icon: <Zap size={18} />, title: 'Ball-Core', desc: 'Enhanced stability for big cubes.' },
        { icon: <Shield size={18} />, title: 'Frosted Surface', desc: 'Anti-slip grip for long solves.' },
        { icon: <Box size={18} />, title: 'Optimized Size', desc: '59mm compact design.' },
      ],
      description: 'A masterpiece of internal alignment. The 4x4 Master eliminates pops and catches during high-speed turning.'
    },
    {
      type: '5x5 Elite',
      size: 5,
      tagline: 'The Ultimate Challenge',
      price: '$44.99',
      specs: [
        { icon: <Zap size={18} />, title: 'Strong Magnets', desc: 'Precise outer layer control.' },
        { icon: <Shield size={18} />, title: 'Primary Internals', desc: 'Buttery smooth turning feel.' },
        { icon: <Box size={18} />, title: 'Lightweight', desc: 'Only 102g for fatigue-free solves.' },
      ],
      description: 'Experience the smoothest 5x5 on the market. Designed for elite solvers who demand perfection in every layer.'
    }
  ];

  const [isChanging, setIsChanging] = useState(false);
  
  const nextCube = () => {
    setIsChanging(true);
    setTimeout(() => setIsChanging(false), 600);
    setCurrentCubeIndex((prev) => (prev + 1) % cubeData.length);
  };
  
  const prevCube = () => {
    setIsChanging(true);
    setTimeout(() => setIsChanging(false), 600);
    setCurrentCubeIndex((prev) => (prev - 1 + cubeData.length) % cubeData.length);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.4) {
      setShowRubiksCube(true);
    } else {
      setShowRubiksCube(false);
    }
  });

  const cubeOpacity = useTransform(scrollYProgress, [0, 0.1, 0.75, 0.82], [1, 1, 1, 0]);
  const cubeScale = useTransform(scrollYProgress, [0, 0.5, 0.8], [1, 0.85, 0.5]);
  const cubeX = useTransform(scrollYProgress, [0, 0.5], ["0%", "-100%"]);

  const materials = [
    { name: 'Classic', color: 'bg-white', price: '$24.99' },
    { name: 'Frosted', color: 'bg-neutral-200', price: '$29.99' },
    { name: 'Carbon', color: 'bg-neutral-800', price: '$34.99' },
  ];

  const [flyingCubes, setFlyingCubes] = useState<{ id: number; x: number; y: number }[]>([]);
  const cartRef = useRef<HTMLDivElement>(null);

  const [cartBump, setCartBump] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    const cartRect = cartRef.current?.getBoundingClientRect();
    
    // Calculate 3D cube's current screen position
    // The cube container is fixed, 50% width. 
    // At scroll > 0.5, it's shifted -100% (to the left half)
    const isOnLeft = scrollYProgress.get() > 0.4;
    const startX = isOnLeft ? window.innerWidth * 0.25 : window.innerWidth * 0.75;
    const startY = window.innerHeight * 0.5;
    
    const id = Date.now();
    const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 60;
    const endY = cartRect ? cartRect.top + cartRect.height / 2 : 40;

    setFlyingCubes(prev => [...prev, { id, x: startX, y: startY, targetX: endX, targetY: endY }]);
    
    // Trigger cart bump after the throw duration
    setTimeout(() => {
      setCartBump(true);
      setTimeout(() => setCartBump(false), 300);
    }, 1000); // Increased to match longer duration

    // Remove cube after animation
    setTimeout(() => {
      setFlyingCubes(prev => prev.filter(cube => cube.id !== id));
    }, 1500);
  };

  return (
    <div ref={containerRef} className="bg-[#f5f5f0] selection:bg-neutral-900 selection:text-white">
      {/* Flying Cubes Layer */}
      <AnimatePresence>
        {flyingCubes.map((cube: any) => (
          <motion.div
            key={cube.id}
            initial={{ 
              x: cube.x - 32, 
              y: cube.y - 32, 
              scale: 0, 
              opacity: 0,
              rotate: -45 
            }}
            animate={{ 
              x: [cube.x - 32, (cube.x + cube.targetX) / 2, cube.targetX - 32],
              y: [cube.y - 32, Math.min(cube.y, cube.targetY) - 250, cube.targetY - 32],
              scale: [0, 2, 0.1], 
              opacity: [0, 1, 1, 0],
              rotate: [0, 450, 1440],
            }}
            transition={{ 
              duration: 1.4, 
              ease: [0.16, 1, 0.3, 1],
              times: [0, 0.4, 1]
            }}
            className="fixed top-0 left-0 z-[200] pointer-events-none"
          >
            <div className="relative">
              <div className="w-16 h-16 grid grid-cols-3 grid-rows-3 gap-0.5 bg-neutral-900 p-1.5 rounded-md shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/40 backdrop-blur-md">
                {[
                  'bg-white', 'bg-yellow-400', 'bg-red-500', 
                  'bg-orange-500', 'bg-blue-500', 'bg-green-500',
                  'bg-white', 'bg-red-500', 'bg-blue-500'
                ].map((color, i) => (
                  <div key={i} className={`w-full h-full rounded-[2px] ${color} shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.2)]`} />
                ))}
              </div>
              {/* Motion Trail / Glow */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
                className="absolute inset-0 bg-white/30 rounded-md blur-2xl -z-10"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Section 1: Hero */}
      <section className="relative w-full h-screen flex flex-col md:flex-row items-center overflow-hidden">
        <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-24 flex flex-col justify-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400 mb-4 block">
              Premium Digital Artifact
            </span>
            <h1 className="font-display text-[15vw] md:text-[8vw] leading-[0.82] uppercase tracking-tighter text-neutral-900">
              The Ultimate<br />
              <span className="text-neutral-400">Puzzle</span><br />
              Experience
            </h1>
            <p className="mt-8 max-w-md text-neutral-500 font-medium leading-relaxed">
              Explore the intricate details of our masterfully crafted geometric challenge. 
              Rotate, zoom, and interact with the future of spatial entertainment.
            </p>
            
            <div className="mt-12 flex items-center gap-6">
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="px-8 py-4 bg-neutral-900 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-all hover:scale-105 shadow-2xl shadow-neutral-900/20"
              >
                Buy Now
              </button>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Starting at</span>
                <span className="text-sm font-mono font-bold text-neutral-900">$24.99</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fixed 3D Container for Section 1 & 2 */}
      <motion.div 
        style={{ 
          opacity: cubeOpacity, 
          scale: cubeScale, 
          x: cubeX,
          display: useTransform(cubeOpacity, (v) => v === 0 ? 'none' : 'block')
        }}
        className="fixed top-0 right-0 w-full md:w-1/2 h-screen pointer-events-none md:pointer-events-auto z-30"
      >
        <Viewer showRubiksCube={showRubiksCube} size={cubeData[currentCubeIndex].size} />
      </motion.div>

      {/* Section 2: Product Details & Shop */}
      <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center bg-white">
        {/* Empty Left Side (Cube will be here via Fixed Container) */}
        <div className="hidden md:block w-1/2 h-full" />

        {/* Right Side Content */}
        <div className="w-full md:w-1/2 p-8 md:p-24 z-20 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCubeIndex}
              initial={{ opacity: 0, x: 100, filter: "blur(10px)" }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                filter: "blur(0px)",
                transition: { duration: 0.5, ease: "easeOut" }
              }}
              exit={{ 
                opacity: 0, 
                x: -100, 
                filter: "blur(10px)",
                transition: { duration: 0.3, ease: "easeIn" }
              }}
              className="max-w-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-400">
                  Product Selection
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={prevCube}
                    className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button 
                    onClick={nextCube}
                    className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <h2 className="font-display text-6xl uppercase tracking-tighter text-neutral-900 mb-2">
                {cubeData[currentCubeIndex].type}
              </h2>
              <p className="text-xl font-medium text-neutral-400 mb-8 italic">
                {cubeData[currentCubeIndex].tagline}
              </p>

              <p className="text-neutral-500 mb-12 leading-relaxed">
                {cubeData[currentCubeIndex].description}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                {cubeData[currentCubeIndex].specs.map((spec, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                      {spec.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-wider text-neutral-900">{spec.title}</h4>
                      <p className="text-xs text-neutral-500 mt-1">{spec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Purchase Card */}
              <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-mono font-bold text-neutral-900">
                      {cubeData[currentCubeIndex].price}
                    </span>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold mt-1">Free Express Shipping</p>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    className="flex items-center gap-3 px-8 py-4 bg-neutral-900 text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-xl shadow-neutral-900/20"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Global UI Elements */}
      <div className="fixed top-8 left-8 md:left-12 z-50 mix-blend-difference">
        <span className="font-display text-2xl tracking-tighter text-white">CUBE.</span>
      </div>
      
      <div ref={cartRef} className="fixed top-8 right-8 md:right-12 z-50 flex gap-4">
        <motion.button 
          animate={cartBump ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="p-2 text-neutral-900 hover:bg-white/50 rounded-full transition-colors relative"
        >
          <ShoppingCart size={20} />
          {cartBump && (
            <motion.span 
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-neutral-900 rounded-full border-2 border-white"
            />
          )}
        </motion.button>
      </div>

      {/* Footer */}
      <footer className="relative z-50 bg-neutral-900 text-white p-12 md:p-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
            <div className="col-span-1 md:col-span-2">
              <span className="font-display text-4xl tracking-tighter mb-6 block">CUBE.</span>
              <p className="text-neutral-400 max-w-xs text-sm leading-relaxed">
                Engineering the world's most advanced spatial puzzles since 2024. 
                Precision, speed, and digital craftsmanship in every rotation.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 mb-6">Navigation</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-neutral-400 transition-colors">Shop All</a></li>
                <li><a href="#" className="hover:text-neutral-400 transition-colors">Pro Series</a></li>
                <li><a href="#" className="hover:text-neutral-400 transition-colors">Accessories</a></li>
                <li><a href="#" className="hover:text-neutral-400 transition-colors">Tutorials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500 mb-6">Company</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-neutral-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-neutral-400 transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-neutral-400 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-neutral-400 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              © 2026 CUBE ARTIFACTS. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Transition Overlay */}
      {isChanging && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0.1, 0.3, 0],
            backgroundColor: ["#ffffff", "#000000", "#ffffff", "#000000", "#ffffff"]
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none z-[100] mix-blend-overlay"
        />
      )}
      
      {isChanging && (
        <motion.div 
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: [10, -10, 5, -5, 0], opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 pointer-events-none z-[101] border-[20px] border-neutral-900/10"
        />
      )}
    </div>
  );
}

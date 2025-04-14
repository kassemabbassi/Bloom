import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideProps } from "lucide-react";
import { 
  ArrowUp, 
  ArrowDown, 
  Sparkles,
  Sun,
  CloudSun,
  Heart 
} from "lucide-react";

type BreathingState = "inhale" | "hold" | "exhale" | "rest";

const breathingInstructions = [
  { state: "inhale", text: "Breathe in through your nose...", duration: 4000, icon: ArrowDown },
  { state: "hold", text: "Hold... let the positive energy fill you...", duration: 2000, icon: Sparkles },
  { state: "exhale", text: "Exhale slowly through your mouth...", duration: 6000, icon: ArrowUp },
  { state: "rest", text: "Feel the tension melting away...", duration: 2000, icon: Sun },
  { state: "inhale", text: "Inhale deeply... bring in fresh energy...", duration: 4000, icon: CloudSun },
  { state: "hold", text: "Hold... feel the calm spreading...", duration: 2000, icon: Heart },
  { state: "exhale", text: "Release all negativity as you exhale...", duration: 6000, icon: ArrowUp },
  { state: "rest", text: "Feel lightness and peace...", duration: 2000, icon: Sparkles },
];

export const AnimatedBreathingGuide = () => {
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentInstruction = breathingInstructions[currentInstructionIndex];
  
  useEffect(() => {
    if (!isAnimating) return;
    
    const timer = setTimeout(() => {
      // Move to next instruction or loop back to beginning
      setCurrentInstructionIndex((prevIndex) => 
        (prevIndex + 1) % breathingInstructions.length
      );
      setProgress(0);
    }, currentInstruction.duration);
    
    // Progress animation - smoother updates with faster refresh rate
    const interval = setInterval(() => {
      setProgress((prev) => {
        const step = 100 / (currentInstruction.duration / 33.33);
        return Math.min(prev + step, 100);
      });
    }, 33.33); // ~30fps for smoother animation
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentInstruction, currentInstructionIndex, isAnimating]);

  const IconComponent = currentInstruction.icon;

  // Bubble size animation based on breathing state - improved smoothness
  const bubbleVariants = {
    inhale: { scale: [1, 1.5], opacity: [0.7, 1] },
    hold: { scale: 1.5, opacity: 1 },
    exhale: { scale: [1.5, 1], opacity: [1, 0.7] },
    rest: { scale: 1, opacity: 0.7 }
  };

  // Animation transition settings
  const transitionSettings = {
    duration: currentInstruction.duration / 1000,
    ease: [0.4, 0, 0.2, 1], // Use cubic-bezier for smoother feel
  };

  return (
    <div className="relative p-5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 shadow-sm">
      <button 
        onClick={() => setIsAnimating(!isAnimating)}
        className="absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-white/60 hover:bg-white/90 text-slate-600 transition-colors"
      >
        {isAnimating ? "Pause" : "Resume"}
      </button>
      
      <div className="flex flex-col items-center justify-center">
        {/* Visual breathing circle */}
        <motion.div 
          className="relative mb-3 flex items-center justify-center"
          animate={currentInstruction.state as keyof typeof bubbleVariants}
          variants={bubbleVariants}
          transition={transitionSettings}
        >
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 opacity-20"
            animate={{ 
              scale: currentInstruction.state === "inhale" ? [1, 1.3] :
                     currentInstruction.state === "exhale" ? [1.3, 1] : undefined
            }}
            transition={transitionSettings}
          />
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 to-purple-300 opacity-20"
            animate={{ 
              scale: currentInstruction.state === "inhale" ? [0.8, 1.1] :
                     currentInstruction.state === "exhale" ? [1.1, 0.8] : undefined
            }}
            transition={transitionSettings}
          />
          <motion.div 
            className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              key={currentInstructionIndex}
              transition={{ duration: 0.3 }}
            >
              <IconComponent 
                className={`w-8 h-8 ${
                  currentInstruction.state === "inhale" ? "text-blue-500" : 
                  currentInstruction.state === "exhale" ? "text-purple-500" : 
                  "text-indigo-400"
                }`}
              />
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Breathing instruction text with AnimatePresence for smoother transitions */}
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p 
              className="text-center text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              key={currentInstructionIndex}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {currentInstruction.text}
            </motion.p>
          </AnimatePresence>
        </div>
        
        {/* Progress bar - improved styling and smoother animation */}
        <div className="w-full mt-3 mb-1 bg-gray-100/60 rounded-full h-1.5 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
            animate={{ width: `${progress}%` }}
            initial={{ width: "0%" }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedBreathingGuide;
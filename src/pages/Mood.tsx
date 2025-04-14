import { motion } from "framer-motion"; // Import Framer Motion
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MoodTracker from "@/components/MoodTracker";

const Mood = () => {
  // Animation variants for the container (stagger children)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delay between child animations
      },
    },
  };

  // Variants for individual elements
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const descriptionVariants = {
    hidden: { opacity: 0, x: 30 }, // Slide from right instead of left
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
    },
  };

  const componentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.4,
        type: "spring",
        stiffness: 90, // Slightly softer spring for a calmer vibe
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bloom-container py-8">
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <motion.h1
              className="text-3xl font-bold mb-4 text-gradient mt-3 leading-tight uppercase tracking-wider font-montserrat"
              variants={textVariants}
            >
              Mood Tracker
            </motion.h1>
            <motion.p
              className="text-foreground/80 max-w-2xl mx-auto"
              variants={descriptionVariants}
            >
              Monitor your emotional wellbeing over time, uncover meaningful patterns with AI-driven analysis, and receive tailored advice to support your mental health journey.
            </motion.p>
          </div>
          
          <motion.div variants={componentVariants}>
            <MoodTracker />
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Mood;
import { motion } from "framer-motion"; // Import Framer Motion
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExpressionDetector from "@/components/ExpressionDetector";

const Express = () => {
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
    hidden: { opacity: 0, x: -30 },
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
        stiffness: 100,
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
              Expression detector
            </motion.h1>
            <motion.p
              className="text-foreground/80 max-w-2xl mx-auto"
              variants={descriptionVariants}
            >
              Detect your mood in real-time through facial expression analysis to help you understand how you're really feeling and support your emotional awareness.
            </motion.p>
          </div>
          
          {/* Component with animation */}
          <motion.div variants={componentVariants}>
            <ExpressionDetector />
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Express;
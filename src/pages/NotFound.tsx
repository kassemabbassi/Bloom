import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Assuming you have framer-motion installed

const NotFound = () => {
  const location = useLocation();
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  // Error logging effect
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Optional: You could add analytics tracking here
    // analytics.track('404_error', { path: location.pathname });
  }, [location.pathname]);

  // Countdown effect
  useEffect(() => {
    if (redirectCountdown > 0) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      window.location.href = "/"; // Auto-redirect after countdown
    }
  }, [redirectCountdown]);

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2 
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br">
      <motion.div 
        className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md mx-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-6xl font-bold mb-4 text-gray-800"
          variants={childVariants}
        >
          404
        </motion.h1>
        
        <motion.p 
          className="text-2xl text-gray-600 mb-2 mt-6"
          variants={childVariants}
        >
          Oops! Page not found
        </motion.p>
        
        <motion.p 
          className="text-gray-500 mb-12 mt-6"
          variants={childVariants}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.div 
          className="space-y-6"
          variants={childVariants}
        >
          <p className="text-sm text-gray-400 mt-4 ">
            Redirecting to home in {redirectCountdown} seconds...
          </p>
          
          <div className="flex justify-center gap-4">
            <a 
              href="/" 
              className="px-6 py-3 w-full bg-wellness-500 text-white rounded-lg hover:bg-wellness-600 transition-colors duration-300"
            >
              Return to Home
            </a>
            

          </div>
        </motion.div>

        {/* Optional: Add a subtle animation */}
        <motion.div
          className="mt-8 opacity-20"
          animate={{ 
            rotate: 360,
            transition: { 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 22s-8-4-8-10 8-10 8-10 8 4 8 10-8 6-8 10z" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
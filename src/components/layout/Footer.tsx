
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-wellness-100 py-8 mt-12 bg-background">
      <div className="bloom-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-1">
              <span className="text-lg font-bold text-gradient">Bloom</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Supporting your mental wellness journey
            </p>
          </div>
          
          <div className="flex items-center gap-6">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            Made with <Heart size={16} className="text-red-400 animate-pulse" /> for your wellbeing
          </p>
          </div>

        </div>
        

      </div>
    </footer>
  );
};

export default Footer;

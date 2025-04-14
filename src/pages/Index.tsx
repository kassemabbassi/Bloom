import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, LineChart, Sparkles, ArrowRight, ScanEye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InteractiveBackground from "@/components/animations/InteractiveBackground";
import FloatingShapes from "@/components/animations/FloatingShapes";
import { useEffect, useState } from "react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animations after component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative ">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden w-screen">
          {/* Full width background container */}
          <div className="absolute inset-0 w-screen -left-[calc(50vw-50%)] -right-[calc(50vw-50%)]">
            {/* Interactive background elements */}
            <InteractiveBackground />
            <FloatingShapes />
          </div>
          
          {/* Content container with standard width */}
          <div className="relative mx-auto text-center z-10 max-w-7xl px-4 w-full">
            <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-8 font-extrabold text-gradient leading-tight tracking-widest font-montserrat animate-[bounce_3s_infinite_ease-in-out]">
              Your AI Guide to<br />Mental Wellness
            </h1>
              <p className="text-lg md:text-xl text-foreground/80 mb-12 max-w-2xl mx-auto animate-pulse-gentle">
                Discover personalized support, insights and exercises powered by
                AI to help you cultivate mental wellbeing.
              </p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 relative z-10 max-w-7xl mx-auto w-full">
            <Card className={`bloom-card transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{transitionDelay: '100ms'}}>
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-wellness-100 flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                  <MessageSquare className="h-6 w-6 text-wellness-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">AI Companion</h3>
                <p className="text-foreground/70">
                  Chat with an AI trained to provide compassionate mental health
                  support and guidance.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="p-0 mt-4 text-wellness-500 group"
                >
                  <Link to="/chat" className="flex items-center gap-1">
                    Start chatting
                    <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className={`bloom-card transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{transitionDelay: '300ms'}}>
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                  <ScanEye className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Face Expression Analysis</h3>
                <p className="text-foreground/70">
                Track and understand your emotions with AI-driven analysis, visualizations, and personalized guidance.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="p-0 mt-4 text-pink-500 group"
                >
                  <Link to="/express" className="flex items-center gap-1">
                    Start analysis
                    <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className={`bloom-card transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{transitionDelay: '200ms'}}>
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-calm-100 flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                  <LineChart className="h-6 w-6 text-calm-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Mood Tracking</h3>
                <p className="text-foreground/70">
                  Record and visualize your emotional patterns with AI-powered
                  insights and recommendations.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="p-0 mt-4 text-calm-500 group"
                >
                  <Link to="/mood" className="flex items-center gap-1">
                    Track now
                    <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>



            <Card className={`bloom-card transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`} style={{transitionDelay: '400ms'}}>
              <CardContent className="pt-6">
                <div className="mb-4 w-12 h-12 rounded-full bg-mint-100 flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
                  <Sparkles className="h-6 w-6 text-mint-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Guided Meditation</h3>
                <p className="text-foreground/70">
                  Experience personalized meditation sessions generated for your
                  specific emotional needs.
                </p>
                <Button
                  asChild
                  variant="link"
                  className="p-0 mt-4 text-mint-500 group"
                >
                  <Link to="/meditate" className="flex items-center gap-1">
                    Meditate now
                    <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-16 bloom-container relative overflow-hidden">
          <div className="bg-gradient-to-br from-wellness-50 to-wellness-100/50 rounded-3xl p-8 md:p-16 relative z-10">
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-wellness-200 rounded-full blur-3xl opacity-30 animate-float-slow"></div>
              <div className="absolute -left-16 -top-16 w-48 h-48 bg-mint-200 rounded-full blur-3xl opacity-30 animate-float"></div>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center animate-slide-up opacity-0" style={{animationDelay: '100ms', animationFillMode: 'forwards'}}>
                How It Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center animate-slide-up opacity-0" style={{animationDelay: '200ms', animationFillMode: 'forwards'}}>
                  <div className="w-16 h-16 rounded-full bg-wellness-100 flex items-center justify-center mx-auto mb-4 shadow-md transform transition-transform duration-300 hover:scale-105">
                    <span className="text-2xl font-bold text-wellness-600">1</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Choose Your Support</h3>
                  <p className="text-foreground/70">
                    Select from our various AI-powered tools designed to support
                    different aspects of mental wellness.
                  </p>
                </div>

                <div className="text-center animate-slide-up opacity-0" style={{animationDelay: '300ms', animationFillMode: 'forwards'}}>
                  <div className="w-16 h-16 rounded-full bg-wellness-100 flex items-center justify-center mx-auto mb-4 shadow-md transform transition-transform duration-300 hover:scale-105">
                    <span className="text-2xl font-bold text-wellness-600">2</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Share Your Thoughts</h3>
                  <p className="text-foreground/70">
                    Interact with our AI through conversation, journaling, or mood
                    tracking to express your feelings.
                  </p>
                </div>

                <div className="text-center animate-slide-up opacity-0" style={{animationDelay: '400ms', animationFillMode: 'forwards'}}>
                  <div className="w-16 h-16 rounded-full bg-wellness-100 flex items-center justify-center mx-auto mb-4 shadow-md transform transition-transform duration-300 hover:scale-105">
                    <span className="text-2xl font-bold text-wellness-600">3</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">
                    Receive Personalized Guidance
                  </h3>
                  <p className="text-foreground/70">
                    Get AI-generated insights, exercises, and content tailored to
                    your unique emotional needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 md:py-12 bloom-container animate-slide-up opacity-0" style={{animationDelay: '500ms', animationFillMode: 'forwards'}}>
          <div className="bg-gradient-to-r from-wellness-500 to-wellness-700 rounded-3xl p-8 md:p-16 text-white text-center shadow-xl relative overflow-hidden transform transition-transform duration-300 hover:scale-[1.01]">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl animate-float-slow"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl animate-float"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Begin Your Wellness Journey Today
              </h2>
              <p className="mb-8 md:max-w-2xl md:mx-auto text-lg opacity-90">
                Take the first step toward improved mental wellbeing with our
                AI-powered tools and resources.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-wellness-700 hover:bg-wellness-50 group shadow-lg transform transition-transform duration-300 hover:scale-105"
              >
                <Link to="/chat" className="flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Utensils, TrendingUp, Apple, Flame } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-elevated mb-4 animate-fade-in">
            <Utensils className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent animate-fade-in">
            CalorieTrack
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Simple, beautiful calorie tracking. Log your meals, track your progress, and reach your health goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-in">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90 text-lg px-8 py-6 shadow-elevated hover:shadow-card transition-all duration-200"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 border-2 hover:bg-primary/5 transition-all duration-200"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4 p-6 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-200">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto">
              <Apple className="w-7 h-7 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Easy Food Logging</h3>
            <p className="text-muted-foreground">
              Quickly add your meals with food name, quantity, and calories in seconds.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-200">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto">
              <TrendingUp className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Track Your Progress</h3>
            <p className="text-muted-foreground">
              See your daily calorie totals and progress towards your goals at a glance.
            </p>
          </div>

          <div className="text-center space-y-4 p-6 rounded-2xl bg-card shadow-card hover:shadow-elevated transition-all duration-200">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center mx-auto">
              <Flame className="w-7 h-7 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Stay Motivated</h3>
            <p className="text-muted-foreground">
              Edit or delete entries anytime and keep your tracking accurate and flexible.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t">
        <p className="text-center text-sm text-muted-foreground">
          © 2025 CalorieTrack. Start tracking your health today.
        </p>
      </footer>
    </div>
  );
};

export default Index;

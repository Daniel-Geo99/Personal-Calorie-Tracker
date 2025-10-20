import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Utensils } from "lucide-react";
import AddFoodForm from "@/components/AddFoodForm";
import FoodEntryCard from "@/components/FoodEntryCard";
import CalorieProgress from "@/components/CalorieProgress";
import KeralaFoodSuggestions from "@/components/KeralaFoodSuggestions";

interface FoodEntry {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  entry_date: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<{ name: string; quantity: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchEntries();
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchEntries = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("food_entries")
      .select("*")
      .eq("entry_date", today)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load entries");
    } else {
      setEntries(data || []);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary w-10 h-10 rounded-xl flex items-center justify-center">
              <Utensils className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CalorieTrack
              </h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="gap-2 hover:border-destructive hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Calorie Progress */}
          <CalorieProgress totalCalories={totalCalories} />

          {/* Kerala Food Suggestions */}
          <KeralaFoodSuggestions onSelect={(name, quantity) => setSelectedFood({ name, quantity })} />

          {/* Add Food Form */}
          <AddFoodForm 
            onEntryAdded={() => {
              fetchEntries();
              setSelectedFood(null);
            }}
            initialFood={selectedFood}
          />

          {/* Food Entries List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Today's Entries</h2>
            {entries.length === 0 ? (
              <div className="text-center py-12 px-4 bg-card rounded-2xl border shadow-card">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Utensils className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No entries yet today</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start tracking by adding your first meal above
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {entries.map((entry) => (
                  <FoodEntryCard key={entry.id} entry={entry} onUpdate={fetchEntries} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

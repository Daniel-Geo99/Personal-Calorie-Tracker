import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Sparkles } from "lucide-react";

interface AddFoodFormProps {
  onEntryAdded: () => void;
  initialFood?: { name: string; quantity: string } | null;
}

const AddFoodForm = ({ onEntryAdded, initialFood }: AddFoodFormProps) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [calories, setCalories] = useState("");
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);

  // Update form when a food is selected from suggestions
  useEffect(() => {
    if (initialFood) {
      setName(initialFood.name);
      setQuantity(initialFood.quantity);
      setCalories(""); // Clear calories so user can estimate
    }
  }, [initialFood]);

  const handleEstimate = async () => {
    if (!name || !quantity) {
      toast.error("Please enter food name and quantity first");
      return;
    }

    setEstimating(true);
    try {
      const { data, error } = await supabase.functions.invoke("estimate-calories", {
        body: { food: name, quantity },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setCalories(data.estimatedCalories.toString());
      setQuantity(data.portionSuggestion);
      
      const confidenceEmoji = data.confidence === "high" ? "✓" : data.confidence === "medium" ? "~" : "?";
      toast.success(`${confidenceEmoji} Estimated: ${data.estimatedCalories} cal`, {
        description: `Confidence: ${data.confidence}`,
      });
    } catch (error: any) {
      console.error("Estimation error:", error);
      toast.error("Failed to estimate calories");
    } finally {
      setEstimating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("food_entries").insert({
      user_id: user.id,
      name,
      quantity,
      calories: parseInt(calories),
    });

    if (error) {
      toast.error("Failed to add entry");
    } else {
      toast.success("Entry added!");
      setName("");
      setQuantity("");
      setCalories("");
      onEntryAdded();
    }

    setLoading(false);
  };

  return (
    <Card className="shadow-card border-2 hover:shadow-elevated transition-shadow duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
            <Plus className="w-5 h-5 text-secondary-foreground" />
          </div>
          Add Food Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Food Name</Label>
              <Input
                id="name"
                placeholder="e.g., Puttu, Apple, Chicken curry"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="transition-all duration-200 focus:shadow-md"
              />
              <p className="text-xs text-muted-foreground">Try Kerala dishes!</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                placeholder="e.g., 1 cup, 2 pieces"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="transition-all duration-200 focus:shadow-md"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                placeholder="AI will estimate"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                min="0"
                className="transition-all duration-200 focus:shadow-md"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleEstimate}
              disabled={estimating || !name || !quantity}
              className="border-2 border-primary hover:bg-primary/10 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {estimating ? "Estimating..." : "AI Estimate"}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 transition-all duration-200"
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              {loading ? "Adding..." : "Add Entry"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddFoodForm;

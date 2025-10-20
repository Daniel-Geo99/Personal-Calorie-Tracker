import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X } from "lucide-react";

interface FoodEntry {
  id: string;
  name: string;
  quantity: string;
  calories: number;
  entry_date: string;
}

interface FoodEntryCardProps {
  entry: FoodEntry;
  onUpdate: () => void;
}

const FoodEntryCard = ({ entry, onUpdate }: FoodEntryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(entry.name);
  const [quantity, setQuantity] = useState(entry.quantity);
  const [calories, setCalories] = useState(entry.calories.toString());
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("food_entries")
      .update({
        name,
        quantity,
        calories: parseInt(calories),
      })
      .eq("id", entry.id);

    if (error) {
      toast.error("Failed to update entry");
    } else {
      toast.success("Entry updated!");
      setIsEditing(false);
      onUpdate();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this entry?")) return;
    
    setLoading(true);
    const { error } = await supabase.from("food_entries").delete().eq("id", entry.id);

    if (error) {
      toast.error("Failed to delete entry");
    } else {
      toast.success("Entry deleted");
      onUpdate();
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setName(entry.name);
    setQuantity(entry.quantity);
    setCalories(entry.calories.toString());
    setIsEditing(false);
  };

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-200 border-l-4 border-l-primary">
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Food name"
                className="transition-all duration-200"
              />
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
                className="transition-all duration-200"
              />
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Calories"
                min="0"
                className="transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={loading}
                className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/90"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} disabled={loading}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-lg truncate">{entry.name}</h3>
              <p className="text-sm text-muted-foreground">
                {entry.quantity} • <span className="font-medium text-secondary">{entry.calories} cal</span>
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodEntryCard;

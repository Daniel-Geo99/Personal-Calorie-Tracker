import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";

interface KeralaFoodSuggestionsProps {
  onSelect: (food: string, quantity: string) => void;
}

const keralaDishes = [
  { name: "Puttu", quantity: "1 cup", emoji: "🍚" },
  { name: "Appam", quantity: "2 pieces", emoji: "🥞" },
  { name: "Idiyappam", quantity: "1 serving", emoji: "🍜" },
  { name: "Kerala Parotta", quantity: "1 piece", emoji: "🫓" },
  { name: "Matta Rice", quantity: "1 cup cooked", emoji: "🍚" },
  { name: "Avial", quantity: "1 katori", emoji: "🥗" },
  { name: "Sambar", quantity: "1 bowl", emoji: "🍲" },
  { name: "Fish Curry", quantity: "1 serving", emoji: "🐟" },
  { name: "Chicken Curry", quantity: "1 serving", emoji: "🍗" },
  { name: "Beef Fry", quantity: "1 serving", emoji: "🥩" },
  { name: "Payasam", quantity: "1 small bowl", emoji: "🍮" },
  { name: "Banana Chips", quantity: "25g", emoji: "🍌" },
];

const KeralaFoodSuggestions = ({ onSelect }: KeralaFoodSuggestionsProps) => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Utensils className="w-5 h-5 text-primary" />
          Kerala Dishes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {keralaDishes.map((dish) => (
            <Button
              key={dish.name}
              variant="outline"
              size="sm"
              onClick={() => onSelect(dish.name, dish.quantity)}
              className="justify-start text-left h-auto py-2 hover:bg-primary/5 hover:border-primary transition-all duration-200"
            >
              <span className="mr-2">{dish.emoji}</span>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs font-medium truncate w-full">{dish.name}</span>
                <span className="text-[10px] text-muted-foreground truncate w-full">{dish.quantity}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeralaFoodSuggestions;

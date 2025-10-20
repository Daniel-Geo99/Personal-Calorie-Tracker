import { Card, CardContent } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface CalorieProgressProps {
  totalCalories: number;
  goalCalories?: number;
}

const CalorieProgress = ({ totalCalories, goalCalories = 2000 }: CalorieProgressProps) => {
  const percentage = Math.min((totalCalories / goalCalories) * 100, 100);

  return (
    <Card className="shadow-elevated border-2 overflow-hidden bg-gradient-to-br from-card to-primary/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">Daily Calories</h2>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {totalCalories}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Goal</p>
            <p className="text-xl font-semibold text-foreground">{goalCalories}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary to-secondary transition-all duration-500 ease-out rounded-full shadow-md"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="mt-3 flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            {totalCalories < goalCalories ? (
              <span>{goalCalories - totalCalories} cal remaining</span>
            ) : (
              <span className="text-secondary">Goal reached! 🎉</span>
            )}
          </p>
          <p className="text-xs font-medium text-foreground">{percentage.toFixed(0)}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieProgress;

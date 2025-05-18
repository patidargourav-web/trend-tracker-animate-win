
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, ChartLine, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WeightData } from '@/types/weight';

interface WeightStatsProps {
  weightData: WeightData[];
  weightGoal?: number;
}

const WeightStats: React.FC<WeightStatsProps> = ({ weightData, weightGoal }) => {
  // Calculate weight statistics
  const calculateStats = () => {
    if (!weightData.length) return { current: 0, average: 0, change: 0, min: 0, max: 0, trend: 'neutral' };

    const weights = weightData.map(d => d.weight);
    const current = weights[weights.length - 1];
    const previous = weights.length > 1 ? weights[weights.length - 2] : current;
    const change = current - previous;
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const average = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    
    // Determine if the overall trend is up, down or neutral
    let trend = 'neutral';
    if (weights.length >= 3) {
      const recentWeights = weights.slice(-3);
      const isIncreasing = recentWeights[2] > recentWeights[0];
      const isDecreasing = recentWeights[2] < recentWeights[0];
      trend = isIncreasing ? 'up' : isDecreasing ? 'down' : 'neutral';
    }

    return {
      current: parseFloat(current.toFixed(1)),
      average: parseFloat(average.toFixed(1)),
      change: parseFloat(change.toFixed(1)),
      min: parseFloat(min.toFixed(1)),
      max: parseFloat(max.toFixed(1)),
      trend
    };
  };

  const stats = calculateStats();
  const goalDistance = weightGoal ? parseFloat((stats.current - weightGoal).toFixed(1)) : null;
  
  const getTrendIcon = () => {
    if (stats.trend === 'up') return <TrendingUp className="h-4 w-4 text-theme-red" />;
    if (stats.trend === 'down') return <TrendingDown className="h-4 w-4 text-theme-green" />;
    return <ChartLine className="h-4 w-4 text-theme-blue" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
      <Card className="stats-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Weight</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold animated-value">
            {stats.current} kg
          </div>
          <div className="flex items-center mt-1 text-xs">
            <div className={cn("flex items-center gap-1", 
              stats.change > 0 ? "text-theme-red" : 
              stats.change < 0 ? "text-theme-green" : 
              "text-muted-foreground"
            )}>
              {stats.change > 0 && <ArrowUp className="h-3 w-3" />}
              {stats.change < 0 && <ArrowDown className="h-3 w-3" />}
              {stats.change === 0 ? "No change" : `${Math.abs(stats.change)} kg`}
            </div>
            <span className="text-muted-foreground ml-1">from last entry</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="stats-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Average</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold animated-value">
            {stats.average} kg
          </div>
          <div className="flex items-center mt-1 text-xs">
            {getTrendIcon()}
            <span className="text-muted-foreground ml-1">Overall trend</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="stats-card">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Range</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="text-2xl font-bold animated-value">
            {stats.min} - {stats.max} kg
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Difference: {parseFloat((stats.max - stats.min).toFixed(1))} kg
          </div>
        </CardContent>
      </Card>
      
      {weightGoal && (
        <Card className="stats-card">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Goal Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold animated-value">
              {weightGoal} kg
            </div>
            <div className={cn("flex items-center mt-1 text-xs", 
              goalDistance! > 0 ? "text-theme-red" : 
              goalDistance! < 0 ? "text-theme-green" : 
              "text-theme-blue"
            )}>
              {goalDistance! > 0 && <ArrowDown className="h-3 w-3" />}
              {goalDistance! < 0 && <ArrowUp className="h-3 w-3" />}
              {goalDistance === 0 ? 
                "Goal reached!" : 
                `${Math.abs(goalDistance!)} kg ${goalDistance! > 0 ? 'to lose' : 'below goal'}`
              }
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeightStats;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, TooltipProps 
} from 'recharts';
import { format } from 'date-fns';
import { ChartLine } from 'lucide-react';
import { WeightData } from '@/types/weight';

interface WeightChartProps {
  weightData: WeightData[];
  weightGoal?: number;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-md">
        <p className="font-medium">{format(new Date(label), 'MMM d, yyyy')}</p>
        <p className="font-bold text-theme-purple">{`${payload[0].value} kg`}</p>
      </div>
    );
  }

  return null;
};

const WeightChart: React.FC<WeightChartProps> = ({ weightData, weightGoal }) => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [animatedData, setAnimatedData] = useState<WeightData[]>([]);
  
  // Prepare chart data based on selected time period
  const getFilteredData = () => {
    if (!weightData.length) return [];
    
    if (period === 'all') return [...weightData];
    
    const now = new Date();
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.setDate(now.getDate() - days));
    
    return weightData.filter(item => new Date(item.date) >= cutoffDate);
  };
  
  // Calculate ideal domain for Y axis to avoid too much empty space
  const calculateYDomain = (data: WeightData[]) => {
    if (!data || data.length === 0) return [0, 100];
    
    const weights = data.map(d => d.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    
    // Add some padding to the min and max values
    const padding = Math.max(2, (max - min) * 0.1);
    const yMin = Math.max(0, min - padding);
    const yMax = max + padding;
    
    return [yMin, yMax];
  };

  // Animate the chart data on mount and when data changes
  useEffect(() => {
    const filteredData = getFilteredData();
    
    // Reset animation state
    setAnimatedData([]);
    
    // Gradually reveal data points for animation effect
    const animationTimeout = setTimeout(() => {
      const intervalTime = 1000 / filteredData.length;
      
      filteredData.forEach((dataPoint, index) => {
        setTimeout(() => {
          setAnimatedData(prev => [...prev, dataPoint]);
        }, index * intervalTime);
      });
    }, 300);
    
    return () => clearTimeout(animationTimeout);
  }, [weightData, period]);

  const filteredData = getFilteredData();
  const yDomain = calculateYDomain(filteredData);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ChartLine className="h-5 w-5 text-theme-purple" />
          Weight Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="30d" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="7d" onClick={() => setPeriod('7d')}>7 Days</TabsTrigger>
            <TabsTrigger value="30d" onClick={() => setPeriod('30d')}>30 Days</TabsTrigger>
            <TabsTrigger value="90d" onClick={() => setPeriod('90d')}>90 Days</TabsTrigger>
            <TabsTrigger value="all" onClick={() => setPeriod('all')}>All</TabsTrigger>
          </TabsList>
          
          <TabsContent value={period} className="mt-0 chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={animatedData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  stroke="var(--muted-foreground)"
                />
                <YAxis 
                  domain={yDomain}
                  tickFormatter={(weight) => `${weight} kg`}
                  stroke="var(--muted-foreground)"
                />
                <Tooltip content={<CustomTooltip />} />
                {weightGoal && (
                  <ReferenceLine 
                    y={weightGoal} 
                    label={{ value: `Goal: ${weightGoal} kg`, position: 'top', fill: 'var(--theme-green)' }}
                    stroke="var(--theme-green)"
                    strokeDasharray="3 3"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ 
                    fill: "hsl(var(--primary))", 
                    stroke: "hsl(var(--background))", 
                    strokeWidth: 2,
                    r: 5, 
                    className: "weight-dot" 
                  }}
                  activeDot={{ r: 7, fill: "hsl(var(--accent))" }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WeightChart;

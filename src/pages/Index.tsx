
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import WeightForm from '@/components/WeightForm';
import WeightStats from '@/components/WeightStats';
import WeightChart from '@/components/WeightChart';
import { useWeightData } from '@/hooks/useWeightData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Weight } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const { 
    weightData, 
    weightGoal, 
    isLoading, 
    addWeightEntry, 
    updateWeightGoal 
  } = useWeightData();
  
  const [newGoal, setNewGoal] = useState<string>('');
  
  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal && !isNaN(parseFloat(newGoal))) {
      updateWeightGoal(parseFloat(newGoal));
      setNewGoal('');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Weight Dashboard</h1>
                  <p className="text-muted-foreground">Track and visualize your weight progress over time.</p>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="stats-card">
                      <CardHeader className="p-4 pb-2">
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <WeightStats weightData={weightData} weightGoal={weightGoal} />
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {isLoading ? (
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                      </CardContent>
                    </Card>
                  ) : (
                    <WeightChart weightData={weightData} weightGoal={weightGoal} />
                  )}
                </div>
                
                <div className="space-y-6">
                  <WeightForm onWeightSubmit={addWeightEntry} />
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Weight className="h-5 w-5 text-theme-purple" />
                        Weight Goal
                      </CardTitle>
                      <CardDescription>Set or update your target weight</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleGoalSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="goal">Target Weight (kg)</Label>
                          <div className="flex w-full items-center gap-2">
                            <Input
                              id="goal"
                              type="number"
                              step="0.1"
                              placeholder={weightGoal ? weightGoal.toString() : "Set a goal"}
                              value={newGoal}
                              onChange={(e) => setNewGoal(e.target.value)}
                              className="flex-1"
                            />
                            <Button type="submit" variant="outline" className="border-theme-purple text-theme-purple hover:bg-theme-purple/10">
                              Set Goal
                            </Button>
                          </div>
                        </div>
                        {weightGoal && (
                          <div className="text-sm text-muted-foreground">
                            Current goal: {weightGoal} kg
                          </div>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Index;

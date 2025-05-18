
import React, { useState } from 'react';
import { format } from 'date-fns';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useSupabaseWeightData } from '@/hooks/useSupabaseWeightData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Weight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { RequireAuth } from '@/components/RequireAuth';

const LogWeight = () => {
  const { addWeightEntry, isLoading } = useSupabaseWeightData();
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0 || !selectedDate) {
      return;
    }
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    addWeightEntry(parseFloat(weight), formattedDate, notes);
    
    setWeight('');
    setNotes('');
    setSelectedDate(new Date());
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 p-6 lg:p-10">
              <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Log Weight</h1>
                  <p className="text-muted-foreground">Record your weight and track your progress over time</p>
                </div>
                
                {isLoading ? (
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-32 ml-auto" />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="animate-fade-in">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Weight className="h-5 w-5 text-theme-purple" />
                        Record New Weight Entry
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                              id="weight"
                              type="number"
                              step="0.1"
                              placeholder="Enter your weight"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="date"
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {selectedDate ? (
                                    format(selectedDate, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  initialFocus
                                  className={cn("p-3 pointer-events-auto")}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes (optional)</Label>
                          <Textarea
                            id="notes"
                            placeholder="How did you feel today? Any observations about your weight?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            className="bg-theme-purple hover:bg-theme-purple/90"
                          >
                            Save Entry
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </RequireAuth>
  );
};

export default LogWeight;

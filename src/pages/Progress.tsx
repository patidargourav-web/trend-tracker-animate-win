
import React, { useState } from 'react';
import { format } from 'date-fns';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useSupabaseWeightData } from '@/hooks/useSupabaseWeightData';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from '@/components/ui/card';
import { ArrowUpDown, Calendar, Trash2 } from 'lucide-react';
import { RequireAuth } from '@/components/RequireAuth';
import WeightChart from '@/components/WeightChart';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Progress = () => {
  const { weightData, weightGoal, isLoading, removeWeightEntry } = useSupabaseWeightData();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteEntryDate, setDeleteEntryDate] = useState<string | null>(null);
  
  // Sort entries based on current sort order
  const sortedData = [...weightData].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
  
  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  const handleDelete = (date: string) => {
    setDeleteEntryDate(date);
  };
  
  const confirmDelete = () => {
    if (deleteEntryDate) {
      removeWeightEntry(deleteEntryDate);
      setDeleteEntryDate(null);
    }
  };
  
  const cancelDelete = () => {
    setDeleteEntryDate(null);
  };

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 p-6 lg:p-10">
              <div className="max-w-7xl mx-auto space-y-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
                  <p className="text-muted-foreground">View and analyze your weight history</p>
                </div>
                
                {isLoading ? (
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-32" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-[300px] w-full" />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <Skeleton className="h-6 w-32" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <WeightChart 
                      weightData={weightData} 
                      weightGoal={weightGoal} 
                    />
                    
                    <Card className="animate-fade-in">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Calendar className="h-5 w-5 text-theme-purple" />
                          Weight History
                        </CardTitle>
                        <CardDescription>
                          All your recorded weight measurements
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {weightData.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground">
                              No weight entries recorded yet. Start by logging your weight!
                            </p>
                            <Button 
                              className="mt-4 bg-theme-purple hover:bg-theme-purple/90"
                              onClick={() => window.location.href = '/log'}
                            >
                              Log Weight Now
                            </Button>
                          </div>
                        ) : (
                          <Table>
                            <TableCaption>Your weight history</TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead onClick={handleSort} className="cursor-pointer w-[200px]">
                                  <div className="flex items-center">
                                    Date
                                    <ArrowUpDown className="ml-2 h-4 w-4" />
                                  </div>
                                </TableHead>
                                <TableHead>Weight (kg)</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sortedData.map((entry) => (
                                <TableRow key={entry.date}>
                                  <TableCell className="font-medium">
                                    {format(new Date(entry.date), 'PPP')}
                                  </TableCell>
                                  <TableCell>{entry.weight}</TableCell>
                                  <TableCell className="text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleDelete(entry.date)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SidebarProvider>
        
        <AlertDialog open={deleteEntryDate !== null} onOpenChange={cancelDelete}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Weight Entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this weight entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </RequireAuth>
  );
};

export default Progress;

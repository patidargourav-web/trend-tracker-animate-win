
import { useState, useEffect } from 'react';
import { WeightData, UserGoal } from '@/types/weight';
import { toast } from 'sonner';

// Sample data for first load
const sampleData: WeightData[] = [
  { date: '2025-05-10', weight: 82.5 },
  { date: '2025-05-11', weight: 82.2 },
  { date: '2025-05-12', weight: 82.7 },
  { date: '2025-05-13', weight: 81.9 },
  { date: '2025-05-14', weight: 81.5 },
  { date: '2025-05-15', weight: 81.2 },
  { date: '2025-05-16', weight: 81.0 },
  { date: '2025-05-17', weight: 80.8 },
  { date: '2025-05-18', weight: 80.5 },
];

const sampleGoal: UserGoal = {
  targetWeight: 75,
  startDate: '2025-05-10',
  targetDate: '2025-07-10',
};

export const useWeightData = () => {
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [weightGoal, setWeightGoal] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load data when component mounts
  useEffect(() => {
    // In a real app, we would load from an API or local storage
    const loadData = () => {
      try {
        const storedData = localStorage.getItem('weightData');
        const storedGoal = localStorage.getItem('weightGoal');
        
        if (storedData) {
          setWeightData(JSON.parse(storedData));
        } else {
          // Use sample data for demo
          setWeightData(sampleData);
        }
        
        if (storedGoal) {
          setWeightGoal(JSON.parse(storedGoal));
        } else {
          // Use sample goal for demo
          setWeightGoal(sampleGoal.targetWeight);
        }
      } catch (error) {
        console.error('Error loading weight data:', error);
        toast.error('Failed to load weight data');
        // Fallback to sample data
        setWeightData(sampleData);
        setWeightGoal(sampleGoal.targetWeight);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Save data whenever it changes
  useEffect(() => {
    if (weightData.length > 0 && !isLoading) {
      localStorage.setItem('weightData', JSON.stringify(weightData));
    }
  }, [weightData, isLoading]);
  
  useEffect(() => {
    if (weightGoal && !isLoading) {
      localStorage.setItem('weightGoal', JSON.stringify(weightGoal));
    }
  }, [weightGoal, isLoading]);
  
  // Add a new weight entry
  const addWeightEntry = (weight: number, date: string) => {
    // Check if we already have an entry for this date
    const existingEntryIndex = weightData.findIndex(entry => entry.date === date);
    
    if (existingEntryIndex !== -1) {
      // Update existing entry
      const updatedData = [...weightData];
      updatedData[existingEntryIndex] = { date, weight };
      
      setWeightData(updatedData.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      
      toast.success('Updated existing weight entry');
    } else {
      // Add new entry
      setWeightData(prev => 
        [...prev, { date, weight }].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      
      toast.success('Added new weight entry');
    }
  };
  
  // Update weight goal
  const updateWeightGoal = (goal: number) => {
    setWeightGoal(goal);
    toast.success(`Weight goal updated to ${goal} kg`);
  };
  
  // Remove a weight entry
  const removeWeightEntry = (date: string) => {
    setWeightData(prev => prev.filter(entry => entry.date !== date));
    toast.success('Weight entry removed');
  };
  
  return {
    weightData,
    weightGoal,
    isLoading,
    addWeightEntry,
    updateWeightGoal,
    removeWeightEntry,
  };
};

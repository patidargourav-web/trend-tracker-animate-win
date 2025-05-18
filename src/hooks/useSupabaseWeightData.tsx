
import { useState, useEffect } from 'react';
import { WeightData } from '@/types/weight';
import { UserWeight, UserGoal } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseWeightData = () => {
  const [weightData, setWeightData] = useState<WeightData[]>([]);
  const [weightGoal, setWeightGoal] = useState<number | undefined>(undefined);
  const [goalTargetDate, setGoalTargetDate] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load data when component mounts or user changes
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load weight entries
        const { data: weightEntries, error: weightError } = await supabase
          .from('user_weights')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (weightError) throw weightError;

        // Load goal
        const { data: goalData, error: goalError } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (goalError && goalError.code !== 'PGRST116') {
          // PGRST116 means no rows returned, which is fine for new users
          throw goalError;
        }

        // Convert to app format
        if (weightEntries) {
          const formattedData = weightEntries.map((entry: UserWeight) => ({
            date: entry.date,
            weight: parseFloat(entry.weight.toString())
          }));
          setWeightData(formattedData);
        }

        if (goalData) {
          setWeightGoal(parseFloat(goalData.target_weight.toString()));
          setGoalTargetDate(goalData.target_date || undefined);
        }
      } catch (error: any) {
        console.error('Error loading weight data:', error);
        toast({
          title: 'Failed to load weight data',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  // Add a new weight entry
  const addWeightEntry = async (weight: number, date: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save weight data',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Check if we already have an entry for this date
      const { data: existingEntry } = await supabase
        .from('user_weights')
        .select('id')
        .eq('user_id', user.id)
        .eq('date', date)
        .single();

      if (existingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from('user_weights')
          .update({ weight })
          .eq('id', existingEntry.id);

        if (error) throw error;

        setWeightData(prev => 
          prev.map(entry => 
            entry.date === date 
              ? { ...entry, weight } 
              : entry
          ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
        
        toast({
          title: 'Weight updated',
          description: `Updated weight entry for ${date}`
        });
      } else {
        // Add new entry - Now including the user_id field
        const { error } = await supabase
          .from('user_weights')
          .insert({ 
            weight, 
            date, 
            user_id: user.id,
            notes: '' // adding empty notes field
          });

        if (error) throw error;

        setWeightData(prev => 
          [...prev, { date, weight }]
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        );
        
        toast({
          title: 'Weight logged',
          description: `${weight} kg has been recorded for ${date}`
        });
      }
    } catch (error: any) {
      console.error('Error saving weight entry:', error);
      toast({
        title: 'Failed to save weight entry',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Update weight goal
  const updateWeightGoal = async (goal: number, targetDate?: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to save goals',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Check if we already have a goal
      const { data: existingGoal } = await supabase
        .from('user_goals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingGoal) {
        // Update existing goal
        const { error } = await supabase
          .from('user_goals')
          .update({ 
            target_weight: goal,
            target_date: targetDate || null
          })
          .eq('id', existingGoal.id);

        if (error) throw error;
      } else {
        // Add new goal - Now including the user_id field
        const { error } = await supabase
          .from('user_goals')
          .insert({ 
            target_weight: goal,
            target_date: targetDate || null,
            user_id: user.id,
            start_date: new Date().toISOString().split('T')[0] // Adding today's date as start_date
          });

        if (error) throw error;
      }

      setWeightGoal(goal);
      setGoalTargetDate(targetDate);
      
      toast({
        title: 'Goal updated',
        description: `Weight goal set to ${goal} kg`
      });
    } catch (error: any) {
      console.error('Error saving goal:', error);
      toast({
        title: 'Failed to save goal',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  // Remove a weight entry
  const removeWeightEntry = async (date: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_weights')
        .delete()
        .eq('user_id', user.id)
        .eq('date', date);

      if (error) throw error;

      setWeightData(prev => prev.filter(entry => entry.date !== date));
      toast({
        title: 'Entry removed',
        description: `Weight entry for ${date} has been deleted`
      });
    } catch (error: any) {
      console.error('Error removing weight entry:', error);
      toast({
        title: 'Failed to remove entry',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return {
    weightData,
    weightGoal,
    goalTargetDate,
    isLoading,
    addWeightEntry,
    updateWeightGoal,
    removeWeightEntry,
  };
};

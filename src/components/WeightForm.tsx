
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Weight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeightFormProps {
  onWeightSubmit: (weight: number, date: string) => void;
}

const WeightForm: React.FC<WeightFormProps> = ({ onWeightSubmit }) => {
  const [weight, setWeight] = useState<string>('');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight value.",
        variant: "destructive"
      });
      return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    onWeightSubmit(parseFloat(weight), today);
    
    toast({
      title: "Weight logged!",
      description: `${weight} kg has been recorded for today.`
    });
    
    setWeight('');
  };

  return (
    <Card className="animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Weight className="h-5 w-5 text-theme-purple" />
          Log Today's Weight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <div className="flex w-full items-center gap-2">
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-theme-purple hover:bg-theme-purple/90">
                Log
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WeightForm;


export interface WeightData {
  date: string;
  weight: number;
}

export interface UserGoal {
  targetWeight: number;
  startDate: string;
  targetDate?: string;
}

export interface UserProfile {
  height?: number; // in cm
  startWeight?: number;
  currentGoal?: UserGoal;
  previousGoals?: UserGoal[];
}

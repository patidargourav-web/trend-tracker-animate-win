
export type UserWeight = {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type UserGoal = {
  id: string;
  user_id: string;
  target_weight: number;
  start_date: string;
  target_date?: string | null;
  created_at: string;
  updated_at: string;
};

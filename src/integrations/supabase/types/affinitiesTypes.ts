
export type Theme = {
  id: string;
  name: string;
  description: string | null;
  category?: string;
  level?: number;
  parent_id?: string | null;
  sort_order?: number;
  created_at: string;
}

export type Activity = {
  id: string;
  name: string;
  category?: string | null;
  level: number;
  parent_id?: string | null;
  sort_order?: number;
  created_at: string;
}

export type Filter = {
  id: string;
  category: string;
  value: string;
  created_at: string;
}

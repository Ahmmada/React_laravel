export type Group = {
  id: number;
  name: string;
};

export type TeacherFormData = {
  id?: number;
  name: string;
  group_id?: number;
  position?: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  notes?: string;
  hourly_rate?: number;
};
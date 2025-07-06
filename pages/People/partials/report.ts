export interface ReportPreset {
  name: string;
  filters: ReportFilters;
  columns: string[];
}

export interface ReportFilters {
  is_male: string;
  is_beneficiary: string;
  location_ids: string[];
  social_state_ids?: string[];
  card_type_ids?: string[];
  housing_type_ids?: string[];
  level_state_ids?: string[];
  has_family?: string;
}

export interface ColumnDefinition {
  field: string;
  label: string;
}

export interface Location {
  id: string;
  name: string;
}

export interface SocialState {
  id: string;
  name: string;
}

export interface CardType {
  id: string;
  name: string;
}

export interface HousingType {
  id: string;
  name: string;
}

export interface LevelState {
  id: string;
  name: string;
}
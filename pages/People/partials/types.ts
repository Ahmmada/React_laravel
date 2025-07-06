export interface Option {
    id: number;
    name: string;
}

export interface FamilyMember {
    id?: number;
    birth_date: string;
    is_male: boolean;
}

export interface PersonFormData {
    name: string;
    is_male: boolean;
    is_beneficiary: boolean;
    birth_date: string;
    card_type_id: number | null;
    card_number: string;
    phone_number: string;
    job: string;
    housing_type_id: number | null;
    housing_address: string;
    location_id: number | null;
    social_state_id: number | null;
    level_state_id: number | null;
    meal_count: number;
    male_count: number;
    female_count: number;
    notes: string;
    family_members: FamilyMember[];
}

export interface FormErrors {
    [key: string]: string;
}
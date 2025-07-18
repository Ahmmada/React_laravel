import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportFilters, Location, SocialState, CardType, HousingType, LevelState } from './report';
import { Filter, Users, MapPin, CreditCard, Home, Heart, UserCheck } from 'lucide-react';
import ExcelStyleFilter from './ExcelStyleFilter';

interface FilterSectionProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  locations: Location[];
  socialStates: SocialState[];
  cardTypes: CardType[];
  housingTypes: HousingType[];
  levelStates: LevelState[];
}

export default function FilterSection({
  filters,
  onFiltersChange,
  locations = [],
  socialStates = [],
  cardTypes = [],
  housingTypes = [],
  levelStates = []
}: FilterSectionProps) {
  const updateFilter = (key: keyof ReportFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  // Convert data to filter options format with safe handling
  const locationOptions = (locations || []).map(loc => ({
    value: String(loc.id),
    label: loc.name,
    count: Math.floor(Math.random() * 100) + 1 // Replace with actual count
  }));

  const cardTypeOptions = (cardTypes || []).map(type => ({
    value: String(type.id),
    label: type.name,
    count: Math.floor(Math.random() * 50) + 1
  }));

  const housingTypeOptions = (housingTypes || []).map(type => ({
    value: String(type.id),
    label: type.name,
    count: Math.floor(Math.random() * 75) + 1
  }));

  const socialStateOptions = (socialStates || []).map(state => ({
    value: String(state.id),
    label: state.name,
    count: Math.floor(Math.random() * 60) + 1
  }));

  const levelStateOptions = (levelStates || []).map(state => ({
    value: String(state.id),
    label: state.name,
    count: Math.floor(Math.random() * 40) + 1
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
          <Filter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">فلاتر التقرير</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">حدد المعايير لتصفية البيانات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gender Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            الجنس
          </label>
          <Select
            value={filters?.is_male || 'all'}
            onValueChange={(val) => updateFilter('is_male', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="اختر الجنس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="male">ذكر</SelectItem>
              <SelectItem value="female">أنثى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Beneficiary Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <UserCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            حالة الاستفادة
          </label>
          <Select
            value={filters?.is_beneficiary || 'all'}
            onValueChange={(val) => updateFilter('is_beneficiary', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="حالة الاستفادة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="1">مستفيد</SelectItem>
              <SelectItem value="0">غير مستفيد</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Family Members Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            أفراد الأسرة
          </label>
          <Select
            value={filters?.has_family || 'all'}
            onValueChange={(val) => updateFilter('has_family', val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="حدد الخيار" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="yes">يوجد أفراد أسرة</SelectItem>
              <SelectItem value="no">لا يوجد أفراد أسرة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Locations Filter - Excel Style */}
        {locationOptions.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              الحارات
            </label>
            <ExcelStyleFilter
              title="اختر الحارات"
              options={locationOptions}
              selectedValues={filters?.location_ids || []}
              onSelectionChange={(values) => updateFilter('location_ids', values)}
              placeholder="البحث في الحارات..."
              showEmptyOption={false}
            />
          </div>
        )}

        {/* Card Types Filter - Excel Style */}
        {cardTypeOptions.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              نوع البطاقة
            </label>
            <ExcelStyleFilter
              title="اختر نوع البطاقة"
              options={cardTypeOptions}
              selectedValues={filters?.card_type_ids || []}
              onSelectionChange={(values) => updateFilter('card_type_ids', values)}
              placeholder="البحث في أنواع البطاقات..."
              showEmptyOption={true}
              emptyOptionLabel="بدون بطاقة"
              emptyOptionCount={8}
            />
          </div>
        )}

        {/* Housing Types Filter - Excel Style */}
        {housingTypeOptions.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Home className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              نوع السكن
            </label>
            <ExcelStyleFilter
              title="اختر نوع السكن"
              options={housingTypeOptions}
              selectedValues={filters?.housing_type_ids || []}
              onSelectionChange={(values) => updateFilter('housing_type_ids', values)}
              placeholder="البحث في أنواع السكن..."
              showEmptyOption={true}
              emptyOptionLabel="سكن غير محدد"
              emptyOptionCount={12}
            />
          </div>
        )}

        {/* Social States Filter - Excel Style */}
        {socialStateOptions.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Heart className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              الحالة الاجتماعية
            </label>
            <ExcelStyleFilter
              title="اختر الحالة الاجتماعية"
              options={socialStateOptions}
              selectedValues={filters?.social_state_ids || []}
              onSelectionChange={(values) => updateFilter('social_state_ids', values)}
              placeholder="البحث في الحالات الاجتماعية..."
              showEmptyOption={true}
              emptyOptionLabel="حالة غير محددة"
              emptyOptionCount={5}
            />
          </div>
        )}

        {/* Level States Filter - Excel Style */}
        {levelStateOptions.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              مستوى الحالة
            </label>
            <ExcelStyleFilter
              title="اختر مستوى الحالة"
              options={levelStateOptions}
              selectedValues={filters?.level_state_ids || []}
              onSelectionChange={(values) => updateFilter('level_state_ids', values)}
              placeholder="البحث في مستويات الحالة..."
              showEmptyOption={true}
              emptyOptionLabel="مستوى غير محدد"
              emptyOptionCount={3}
            />
          </div>
        )}
      </div>

      {/* Show message if no filter options available */}
      {locationOptions.length === 0 && cardTypeOptions.length === 0 && housingTypeOptions.length === 0 && 
       socialStateOptions.length === 0 && levelStateOptions.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد خيارات فلترة متاحة حالياً</p>
          <p className="text-sm">تأكد من وجود البيانات الأساسية في النظام</p>
        </div>
      )}
    </div>
  );
}
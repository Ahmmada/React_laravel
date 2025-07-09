import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDefinition } from "./report";
import { Grid, Eye } from 'lucide-react';

interface ColumnSelectorProps {
  allColumns: ColumnDefinition[];
  selectedColumns: string[];
  onToggleColumn: (field: string) => void;
}

export default function ColumnSelector({ 
  allColumns = [], 
  selectedColumns = [], 
  onToggleColumn 
}: ColumnSelectorProps) {
  // Default columns if none provided
  const defaultColumns: ColumnDefinition[] = [
    { field: 'id', label: 'ID' },
    { field: 'name', label: 'الاسم' },
    { field: 'birth_date', label: 'تاريخ الميلاد' },
    { field: 'phone_number', label: 'رقم الهاتف' },
    { field: 'job', label: 'المهنة' },
    { field: 'card_type.name', label: 'نوع البطاقة' },
    { field: 'housing_type.name', label: 'نوع السكن' },
    { field: 'location.name', label: 'الحارة' },
    { field: 'is_male', label: 'الجنس' },
    { field: 'is_beneficiary', label: 'مستفيد؟' },
    { field: 'card_number', label: 'رقم البطاقة' },
    { field: 'housing_address', label: 'عنوان السكن' },
    { field: 'social_state.name', label: 'الحالة الاجتماعية' },
    { field: 'level_state.name', label: 'مستوى الحالة' },
    { field: 'meal_count', label: 'عدد الحالات' },
    { field: 'male_count', label: 'عدد الذكور' },
    { field: 'female_count', label: 'عدد الإناث' },
    { field: 'family_members', label: 'عدد أفراد الأسرة' },
    { field: 'notes', label: 'ملاحظات' },
  ];

  const columnsToUse = allColumns.length > 0 ? allColumns : defaultColumns;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <Grid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">الأعمدة المعروضة</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">اختر الأعمدة التي تريد عرضها في التقرير</p>
        </div>
      </div>
      
      {columnsToUse.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {columnsToUse.map((col) => (
              <label 
                key={col.field} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedColumns.includes(col.field)}
                  onCheckedChange={() => onToggleColumn(col.field)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  {col.label}
                </span>
              </label>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span>تم اختيار {selectedColumns.length} من {columnsToUse.length} عمود</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => columnsToUse.forEach(col => {
                    if (!selectedColumns.includes(col.field)) {
                      onToggleColumn(col.field);
                    }
                  })}
                  className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  تحديد الكل
                </button>
                <button
                  onClick={() => selectedColumns.forEach(field => onToggleColumn(field))}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  إلغاء الكل
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد أعمدة متاحة للعرض</p>
          <p className="text-sm">تأكد من تحديد الأعمدة المطلوبة</p>
        </div>
      )}
    </div>
  );
}
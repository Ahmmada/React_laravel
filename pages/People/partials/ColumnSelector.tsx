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
  allColumns, 
  selectedColumns, 
  onToggleColumn 
}: ColumnSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Grid className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">الأعمدة المعروضة</h2>
          <p className="text-sm text-gray-500">اختر الأعمدة التي تريد عرضها في التقرير</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allColumns.map((col) => (
          <label 
            key={col.field} 
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={selectedColumns.includes(col.field)}
              onCheckedChange={() => onToggleColumn(col.field)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">
              {col.label}
            </span>
          </label>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Eye className="w-4 h-4" />
          <span>تم اختيار {selectedColumns.length} من {allColumns.length} عمود</span>
        </div>
      </div>
    </div>
  );
}
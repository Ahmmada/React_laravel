import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Check, Minus, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface ExcelStyleFilterProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  showCounts?: boolean;
  showEmptyOption?: boolean;
  emptyOptionLabel?: string;
  emptyOptionCount?: number;
}

export default function ExcelStyleFilter({
  title,
  options = [],
  selectedValues = [],
  onSelectionChange,
  placeholder = "البحث...",
  showCounts = true,
  showEmptyOption = true,
  emptyOptionLabel = "الحقول الفارغة",
  emptyOptionCount = 0
}: ExcelStyleFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Include empty option in calculations
  const totalOptions = showEmptyOption ? options.length + 1 : options.length;
  const allSelected = selectedValues.length === totalOptions;
  const someSelected = selectedValues.length > 0 && selectedValues.length < totalOptions;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      const allValues = options.map(opt => opt.value);
      if (showEmptyOption) {
        allValues.push('__EMPTY__');
      }
      onSelectionChange(allValues);
    }
  };

  const handleOptionToggle = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onSelectionChange(newSelection);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return 'لا شيء محدد';
    if (allSelected) return 'الكل محدد';
    if (selectedValues.length === 1) {
      if (selectedValues[0] === '__EMPTY__') return emptyOptionLabel;
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} عنصر محدد`;
  };

  const shouldShowEmptyOption = showEmptyOption && (!searchTerm || emptyOptionLabel.toLowerCase().includes(searchTerm.toLowerCase()));

  // If no options available, show a simple disabled select
  if (options.length === 0 && !showEmptyOption) {
    return (
      <div className="relative">
        <button
          type="button"
          disabled
          className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-sm text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          <span>لا توجد خيارات متاحة</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <span className={`truncate ${selectedValues.length === 0 ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
          {getDisplayText()}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-2">{title}</h4>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="pl-9 h-8 text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500"
              />
            </div>
          </div>

          {/* Select All */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-600">
            <label className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-600 rounded cursor-pointer">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {allSelected ? 'إلغاء تحديد الكل' : 'تحديد الكل'}
              </span>
              {showCounts && (
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-auto">
                  ({totalOptions})
                </span>
              )}
            </label>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {/* Empty Option */}
            {shouldShowEmptyOption && (
              <label className="flex items-center gap-3 p-2 hover:bg-amber-50 dark:hover:bg-amber-900/30 cursor-pointer group border-b border-gray-100 dark:border-gray-600">
                <Checkbox
                  checked={selectedValues.includes('__EMPTY__')}
                  onCheckedChange={() => handleOptionToggle('__EMPTY__')}
                  className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                />
                <span className="text-sm text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 flex-1 font-medium italic">
                  {emptyOptionLabel}
                </span>
                {showCounts && emptyOptionCount !== undefined && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                    ({emptyOptionCount})
                  </span>
                )}
              </label>
            )}

            {/* Regular Options */}
            {filteredOptions.length === 0 && !shouldShowEmptyOption ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                لا توجد نتائج
              </div>
            ) : (
              filteredOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer group"
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onCheckedChange={() => handleOptionToggle(option.value)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 flex-1">
                    {option.label}
                  </span>
                  {showCounts && option.count !== undefined && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      ({option.count})
                    </span>
                  )}
                </label>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {selectedValues.length} من {totalOptions} محدد
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setIsOpen(false);
                }}
                className="text-xs h-7 px-3"
              >
                إغلاق
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onSelectionChange([]);
                  setIsOpen(false);
                }}
                className="text-xs h-7 px-3 bg-red-600 hover:bg-red-700"
              >
                مسح الكل
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
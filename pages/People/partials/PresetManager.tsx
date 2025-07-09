import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReportPreset, ReportFilters } from "./report";
import { Save, FolderOpen, Star, Trash2, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface PresetManagerProps {
  filters: ReportFilters;
  selectedColumns: string[];
  onLoadPreset: (preset: ReportPreset) => void;
}

export default function PresetManager({ 
  filters, 
  selectedColumns = [], 
  onLoadPreset 
}: PresetManagerProps) {
  const [presetName, setPresetName] = useState('');
  const [availablePresets, setAvailablePresets] = useState<ReportPreset[]>([]);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = () => {
    try {
      const presets = JSON.parse(localStorage.getItem('reportPresets') || '[]');
      setAvailablePresets(Array.isArray(presets) ? presets : []);
    } catch (error) {
      console.error('Error loading presets:', error);
      setAvailablePresets([]);
    }
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      toast.error('يرجى إدخال اسم للإعداد');
      return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem('reportPresets') || '[]');
      const newPreset: ReportPreset = {
        name: presetName.trim(),
        filters: filters || {
          is_male: 'all',
          is_beneficiary: 'all',
          location_ids: [],
          social_state_ids: [],
          card_type_ids: [], 
          housing_type_ids: [],
          level_state_ids: [],
          has_family: 'all',
        },
        columns: selectedColumns,
      };

      const updated = [...(Array.isArray(existing) ? existing : []).filter(p => p.name !== presetName), newPreset];
      localStorage.setItem('reportPresets', JSON.stringify(updated));
      
      setAvailablePresets(updated);
      setPresetName('');
      toast.success(`تم حفظ الإعداد باسم "${presetName}"`);
    } catch (error) {
      console.error('Error saving preset:', error);
      toast.error('حدث خطأ أثناء حفظ الإعداد');
    }
  };

  const deletePreset = (presetName: string) => {
    try {
      const updated = availablePresets.filter(p => p.name !== presetName);
      localStorage.setItem('reportPresets', JSON.stringify(updated));
      setAvailablePresets(updated);
      toast.success(`تم حذف الإعداد "${presetName}"`);
    } catch (error) {
      console.error('Error deleting preset:', error);
      toast.error('حدث خطأ أثناء حذف الإعداد');
    }
  };

  const handleLoadPreset = (preset: ReportPreset) => {
    try {
      // Ensure preset has valid structure
      const validPreset = {
        ...preset,
        filters: preset.filters || {
          is_male: 'all',
          is_beneficiary: 'all',
          location_ids: [],
          social_state_ids: [],
          card_type_ids: [], 
          housing_type_ids: [],
          level_state_ids: [],
          has_family: 'all',
        },
        columns: Array.isArray(preset.columns) ? preset.columns : []
      };
      
      onLoadPreset(validPreset);
      toast.success(`تم تحميل الإعداد: ${preset.name}`);
    } catch (error) {
      console.error('Error loading preset:', error);
      toast.error('حدث خطأ أثناء تحميل الإعداد');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
          <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">الإعدادات المفضلة</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">احفظ وأعد استخدام إعدادات الفرز</p>
        </div>
      </div>

      {/* Save New Preset */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <Input
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="أدخل اسم الإعداد مثل: الأعمدة الأساسية"
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && savePreset()}
          />
          <Button 
            onClick={savePreset}
            disabled={!presetName.trim()}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            <Save className="w-4 h-4 mr-2" />
            حفظ
          </Button>
        </div>
      </div>

      {/* Load Existing Presets */}
      {availablePresets.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <FolderOpen className="w-4 h-4" />
            الإعدادات المحفوظة ({availablePresets.length})
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availablePresets.map((preset) => (
              <div 
                key={preset.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 block truncate">
                    {preset.name}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {(preset.columns || []).length} أعمدة • 
                    {Object.values(preset.filters || {}).filter(v => {
                      if (v === null || v === undefined || v === 'all') return false;
                      if (Array.isArray(v)) return v.length > 0;
                      return true;
                    }).length} فلاتر نشطة
                  </div>
                </div>
                
                <div className="flex gap-2 ml-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadPreset(preset)}
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    تحميل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePreset(preset.name)}
                    className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>لا توجد إعدادات محفوظة</p>
          <p className="text-sm">احفظ إعداداتك المفضلة لاستخدامها لاحقاً</p>
        </div>
      )}
    </div>
  );
}
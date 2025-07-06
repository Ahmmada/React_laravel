import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from './ui/input';
import { ReportPreset, ReportFilters } from "./report";
import { Save, FolderOpen, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface PresetManagerProps {
  filters: ReportFilters;
  selectedColumns: string[];
  onLoadPreset: (preset: ReportPreset) => void;
}

export default function PresetManager({ 
  filters, 
  selectedColumns, 
  onLoadPreset 
}: PresetManagerProps) {
  const [presetName, setPresetName] = useState('');
  const [availablePresets, setAvailablePresets] = useState<ReportPreset[]>([]);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = () => {
    const presets = JSON.parse(localStorage.getItem('reportPresets') || '[]');
    setAvailablePresets(presets);
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      toast.error('يرجى إدخال اسم للإعداد');
      return;
    }

    const existing = JSON.parse(localStorage.getItem('reportPresets') || '[]');
    const newPreset: ReportPreset = {
      name: presetName,
      filters,
      columns: selectedColumns,
    };

    const updated = [...existing.filter(p => p.name !== presetName), newPreset];
    localStorage.setItem('reportPresets', JSON.stringify(updated));
    
    setAvailablePresets(updated);
    setPresetName('');
    toast.success(`تم حفظ الإعداد باسم "${presetName}"`);
  };

  const deletePreset = (presetName: string) => {
    const updated = availablePresets.filter(p => p.name !== presetName);
    localStorage.setItem('reportPresets', JSON.stringify(updated));
    setAvailablePresets(updated);
    toast.success(`تم حذف الإعداد "${presetName}"`);
  };

  const handleLoadPreset = (preset: ReportPreset) => {
    onLoadPreset(preset);
    toast.success(`تم تحميل الإعداد: ${preset.name}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 rounded-lg">
          <Star className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">الإعدادات المفضلة</h2>
          <p className="text-sm text-gray-500">احفظ وأعد استخدام إعدادات الفرز</p>
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
          />
          <Button 
            onClick={savePreset}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            <Save className="w-4 h-4 mr-2" />
            حفظ
          </Button>
        </div>
      </div>

      {/* Load Existing Presets */}
      {availablePresets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <FolderOpen className="w-4 h-4" />
            الإعدادات المحفوظة
          </div>
          
          <div className="space-y-2">
            {availablePresets.map((preset) => (
              <div 
                key={preset.name}
                className="flex items-center justify-between p-1 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-900">{preset.name}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.columns.length} أعمدة • فلاتر متعددة
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadPreset(preset)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    تحميل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePreset(preset.name)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { AG_GRID_LOCALE_EG } from '@/locales/ar.ts';
import { Button } from '@/components/ui/button';
import ThemedAgGrid from '@/components/shared/themed-ag-grid';
import { createColumnDefinitions } from "./partials/columnDefinitions";
import { submitExcelExport, submitPdfExport } from "./partials/exportHelpers";
import { 
  FileText, 
  Settings, 
  Download, 
  Plus, 
  Users, 
  BarChart3, 
  Filter,
  Grid,
  ChevronDown,
  ChevronUp,
  Star,
  X,
  Check
} from 'lucide-react';
import NameCellRenderer from './partials/NameCellRenderer';
import { toast } from "sonner";
import FilterSection from './partials/FilterSection';
import ColumnSelector from './partials/ColumnSelector';
import PresetManager from './partials/PresetManager';
import { ReportFilters, ReportPreset, ColumnDefinition } from './partials/report';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

ModuleRegistry.registerModules([AllEnterpriseModule]);

interface PageProps {
  people: any[];
  columns: string[];
  filters: ReportFilters;
  allColumns: ColumnDefinition[];
  locations: any[];
  socialStates: any[];
  cardTypes: any[];
  housingTypes: any[];
  levelStates: any[];
  flash?: { success?: string };
}

// Default values to prevent TypeError
const defaultFilters: ReportFilters = {
  is_male: 'all',
  is_beneficiary: 'all',
  location_ids: [],
  social_state_ids: [],
  card_type_ids: [], 
  housing_type_ids: [],
  level_state_ids: [],
  has_family: 'all',
};

export default function ReportView() {
  const { 
    people, 
    columns, 
    filters: initialFilters,
    allColumns,
    locations,
    socialStates,
    cardTypes,
    housingTypes,
    levelStates,
    flash 
  } = usePage().props as PageProps;

  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<any>(null);
  
  // State for integrated settings with safe defaults
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns || []);
  const [filters, setFilters] = useState<ReportFilters>(initialFilters || defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

  useEffect(() => {
    if (gridApi && people.length > 0) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi, people.length]);

  // Check for unsaved changes
  useEffect(() => {
    const columnsChanged = JSON.stringify(selectedColumns) !== JSON.stringify(columns || []);
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(initialFilters || defaultFilters);
    setHasUnsavedChanges(columnsChanged || filtersChanged);
  }, [selectedColumns, filters, columns, initialFilters]);

  const allColumnDefs = useMemo(() => createColumnDefinitions(), []);

  const selectedColumnDefs = useMemo(() => {
    return selectedColumns.map(col => allColumnDefs[col]).filter(Boolean);
  }, [selectedColumns, allColumnDefs]);

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    suppressHeaderMenuButton: true,
  };

  const toggleColumn = (field: string) => {
    setSelectedColumns(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleLoadPreset = (preset: ReportPreset) => {
    setFilters(preset.filters);
    setSelectedColumns(preset.columns);
  };

  const handleApplyChanges = () => {
    localStorage.setItem('peopleFilters', JSON.stringify(filters));
    localStorage.setItem('peopleColumns', JSON.stringify(selectedColumns));

    router.visit('/people/report', {
      method: 'post',
      data: {
        columns: selectedColumns,
        filters,
      },
      preserveState: true,
      onSuccess: () => {
        toast.success('تم تطبيق التغييرات بنجاح');
        setHasUnsavedChanges(false);
        // Close all panels
        setShowFilters(false);
        setShowColumnSelector(false);
        setShowPresets(false);
      },
    });
  };

  const handleResetChanges = () => {
    setSelectedColumns(columns || []);
    setFilters(initialFilters || defaultFilters);
    setHasUnsavedChanges(false);
    toast.success('تم إعادة تعيين التغييرات');
  };

  const handleExcelExport = useCallback(() => submitExcelExport(), []);
  const handlePdfExport = useCallback(() => submitPdfExport(), []);

  // Enhanced action button component
  const ActionButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    variant = 'default',
    isActive = false,
    badge = null,
    className = ''
  }: {
    icon: React.ComponentType<any>;
    label: string;
    onClick: () => void;
    variant?: 'default' | 'primary' | 'success' | 'warning';
    isActive?: boolean;
    badge?: string | number | null;
    className?: string;
  }) => {
    const variants = {
      default: 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-gray-100',
      primary: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300 dark:hover:text-blue-200',
      success: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700 hover:text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:border-green-700 dark:text-green-300 dark:hover:text-green-200',
      warning: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 hover:text-amber-800 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:border-amber-700 dark:text-amber-300 dark:hover:text-amber-200',
    };

    return (
      <button
        onClick={onClick}
        className={`
          relative flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200
          shadow-sm hover:shadow-md font-medium text-sm whitespace-nowrap
          ${variants[variant]}
          ${isActive ? 'ring-2 ring-blue-500 ring-opacity-50 dark:ring-blue-400' : ''}
          ${className}
        `}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span>{label}</span>
        {badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    );
  };

  // Safe filter count calculation
  const getActiveFilterCount = () => {
    if (!filters) return 0;
    return Object.values(filters).filter(v => {
      if (v === null || v === undefined || v === 'all') return false;
      if (Array.isArray(v)) return v.length > 0;
      return true;
    }).length;
  };

  return (
    <AppLayout breadcrumbs={[{ title: "عرض التقرير" }]}>
      <Head title="عرض التقرير" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-4 max-w-7xl">
          
          {/* Enhanced Header with Scrollable Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">تقرير البيانات</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    عرض وإدارة بيانات الأشخاص مع إمكانيات التصفية والتصدير
                  </p>
                </div>
                {hasUnsavedChanges && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      تغييرات غير محفوظة
                    </div>
                    <Button size="sm" onClick={handleApplyChanges} className="bg-blue-600 hover:bg-blue-700">
                      <Check className="w-4 h-4 mr-1" />
                      تطبيق
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleResetChanges}>
                      <X className="w-4 h-4 mr-1" />
                      إلغاء
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Scrollable Actions Bar */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <div className="flex items-center gap-3 p-4 min-w-max">
                <ActionButton
                  icon={Plus}
                  label="إضافة شخص جديد"
                  onClick={() => router.get(route('people.create'))}
                  variant="primary"
                />
                
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                
                <ActionButton
                  icon={Filter}
                  label="الفلاتر"
                  onClick={() => setShowFilters(!showFilters)}
                  isActive={showFilters}
                  badge={getActiveFilterCount() || null}
                />
                
                <ActionButton
                  icon={Grid}
                  label="الأعمدة"
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  isActive={showColumnSelector}
                  badge={selectedColumns.length}
                />
                
                <ActionButton
                  icon={Star}
                  label="الإعدادات المحفوظة"
                  onClick={() => setShowPresets(!showPresets)}
                  isActive={showPresets}
                  variant="warning"
                />
                
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
                
                <ActionButton
                  icon={Download}
                  label="تصدير Excel"
                  onClick={handleExcelExport}
                  variant="success"
                />
                
                <ActionButton
                  icon={Download}
                  label="تصدير PDF"
                  onClick={handlePdfExport}
                  variant="success"
                />
              </div>
            </div>
          </div>

          {/* Integrated Settings Sections */}
          <div className="space-y-4 mb-6">
            {/* Filter Section */}
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleContent>
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <FilterSection
                    filters={filters}
                    onFiltersChange={setFilters}
                    locations={locations || []}
                    socialStates={socialStates || []}
                    cardTypes={cardTypes || []}
                    housingTypes={housingTypes || []}
                    levelStates={levelStates || []}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Column Selector */}
            <Collapsible open={showColumnSelector} onOpenChange={setShowColumnSelector}>
              <CollapsibleContent>
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <ColumnSelector
                    allColumns={allColumns || []}
                    selectedColumns={selectedColumns}
                    onToggleColumn={toggleColumn}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Preset Manager */}
            <Collapsible open={showPresets} onOpenChange={setShowPresets}>
              <CollapsibleContent>
                <div className="animate-in slide-in-from-top-2 duration-200">
                  <PresetManager
                    filters={filters}
                    selectedColumns={selectedColumns}
                    onLoadPreset={handleLoadPreset}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي السجلات</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{(people || []).length.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <Grid className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">الأعمدة المعروضة</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedColumns.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">الصفحات</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.ceil((people || []).length / 20)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <ThemedAgGrid
              ref={gridRef}
              rowData={people || []}
              columnDefs={selectedColumnDefs}
              defaultColDef={defaultColDef}
              onGridReady={(params) => setGridApi(params.api)}
              pagination={true}
              paginationPageSize={20}
              animateRows={true}
              enableRtl={true}
              localeText={AG_GRID_LOCALE_EG}
              domLayout="autoHeight"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
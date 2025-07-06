import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { AG_GRID_LOCALE_EG } from '@/locales/ar.ts';
import { Button } from '@/components/ui/button';
import ThemedAgGrid from '@/components/shared/themed-ag-grid';
import { createColumnDefinitions } from "./partials/columnDefinitions";
import { submitExcelExport, submitPdfExport } from "./partials/exportHelpers";
import { FileText, Settings, Download, Plus, Users, BarChart3, Filter, Grid } from 'lucide-react';
import NameCellRenderer from './partials/NameCellRenderer';
import { toast } from "sonner";
import FilterSection from './partials/FilterSection';
import ColumnSelector from './partials/ColumnSelector';
import PresetManager from './partials/PresetManager';
import { ReportFilters, ReportPreset, ColumnDefinition } from './partials/report';

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

export default function PeopleReport() {
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

  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

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

  const handleExcelExport = () => {
    submitExcelExport();
  };

  const handlePdfExport = () => {
    submitPdfExport();
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تقرير البيانات" }]}>
      <Head title="تقرير البيانات" />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto py-3 max-w-7xl">
          {/* Header Controls */}
          <div className="max-w-7xl mx-auto p-1">
            <div className="flex overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8" dir="rtl">
              <div className="flex space-x-1 min-w-max">
                <Link href={route('people.create')}>
                  <Button size="sm" className="border-gray-300 hover:border-blue-500 hover:text-blue-600">
                    <Plus className="w-4 h-4 mr-0" /> 
                    إضافة شخص جديد
                  </Button>
                </Link>
                
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  الفلاتر
                </Button>

                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  الأعمدة
                </Button>

                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPresets(!showPresets)}
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  الإعدادات المحفوظة
                </Button>
                
                <Button 
                  onClick={handleExcelExport}
                  variant="outline" 
                  size="sm"
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير Excel
                </Button>
                
                <Button 
                  onClick={handlePdfExport}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  تصدير PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          {showFilters && (
            <div className="mb-4">
              <FilterSection
                filters={filters}
                onFiltersChange={setFilters}
                locations={locations}
                socialStates={socialStates}
                cardTypes={cardTypes}
                housingTypes={housingTypes}
                levelStates={levelStates}
              />
            </div>
          )}

          {/* Column Selector */}
          {showColumnSelector && (
            <div className="mb-4">
              <ColumnSelector
                allColumns={allColumns}
                selectedColumns={selectedColumns}
                onToggleColumn={toggleColumn}
              />
            </div>
          )}

          {/* Preset Manager */}
          {showPresets && (
            <div className="mb-4">
              <PresetManager
                filters={filters}
                selectedColumns={selectedColumns}
                onLoadPreset={handleLoadPreset}
              />
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-1 mb-2 px-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-blue-50 rounded-sm">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">إجمالي السجلات</p>
                  <p className="text-sm font-bold text-gray-900">{people.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-blue-50 rounded-sm">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">الأعمدة المعروضة</p>
                  <p className="text-sm font-bold text-gray-900">{selectedColumns.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-blue-50 rounded-sm">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">الصفحات</p>
                  <p className="text-sm font-bold text-gray-900">{Math.ceil(people.length / 20)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div className="p-0">
            <ThemedAgGrid
              rowData={people}
              columnDefs={selectedColumnDefs}
              defaultColDef={defaultColDef}
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
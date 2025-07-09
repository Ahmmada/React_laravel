import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
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
import { FileText, Settings, Download, Plus, Users, BarChart3 } from 'lucide-react';
import NameCellRenderer from './partials/NameCellRenderer';
import { toast } from "sonner";

ModuleRegistry.registerModules([AllEnterpriseModule]);

interface PageProps {
  people: any[];
  columns: string[];
}

export default function ReportView() {
  const { people, columns, flash } = usePage().props as { 
      PageProps;
      flash?: { success?: string };
  };

  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<any>(null);

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

  const allColumnDefs = useMemo(() => createColumnDefinitions(), []);

  const selectedColumnDefs = useMemo(() => {
    return columns.map(col => allColumnDefs[col]).filter(Boolean);
  }, [columns, allColumnDefs]);

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
    floatingFilter: true,
    suppressHeaderMenuButton: true,
  };

  const handleExcelExport = useCallback(() => submitExcelExport(gridApi), []);
  const handlePdfExport = useCallback(() => submitPdfExport(gridApi), []);

  return (
    <AppLayout breadcrumbs={[{ title: "عرض التقرير" }]}>
      <Head title="عرض التقرير" />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-3 max-w-7xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
        <div className="flex overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8" dir="rtl">
          <div className="flex space-x-1 min-w-max">
              <Link href={route('people.create')}>
                <Button 
                  size="sm"
                  className="border-border hover:border-primary hover:text-primary"
                >
                  <Plus className="w-4 h-4 mr-0" /> 
                  إضافة شخص جديد
                </Button>
              </Link>
              <Link href={route('people.report.setup')}>
                <Button 
                  size="sm"
                  className="border-border hover:border-primary hover:text-primary"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  تعديل الإعدادات
                </Button>
              </Link>
              <Button 
                onClick={handleExcelExport}
                variant="outline" 
                size="sm"
                className="border-border hover:border-primary hover:text-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير Excel
              </Button>
              <Button 
                onClick={handlePdfExport}
                variant="outline"
                size="sm"
                className="border-border hover:border-primary hover:text-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                تصدير PDF
              </Button>
            </div>
          </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-1 mb-2">
            <div className="bg-card rounded-xl shadow-sm border border-border p-2">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-blue-50 dark:bg-blue-900 rounded-sm">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">إجمالي السجلات</p>
                  <p className="text-sm font-bold text-foreground">{people.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-sm border border-border p-2">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-green-50 dark:bg-green-900 rounded-sm">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الأعمدة المعروضة</p>
                  <p className="text-sm font-bold text-foreground">{columns.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl shadow-sm border border-border p-2">
              <div className="flex items-center gap-3">
                <div className="p-1 bg-purple-50 dark:bg-purple-900 rounded-sm">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الصفحات</p>
                  <p className="text-sm font-bold text-foreground">{Math.ceil(people.length / 20)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Grid */}
          <div className="p-0">
            <AgGridReact
              ref={gridRef}
              rowData={people}
              columnDefs={selectedColumnDefs}
              defaultColDef={defaultColDef}
              onGridReady={(params) => setGridApi(params.api)}
              pagination={true}
              paginationPageSize={20}
              animateRows={true}
              enableRtl={true}
              localeText={AG_GRID_LOCALE_EG}
              domLayout="autoHeight"
              className="ag-theme-alpine"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
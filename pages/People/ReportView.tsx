import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { AG_GRID_LOCALE_EG } from '@/locales/ar.ts';
import { Button } from '@/components/ui/button';
import ThemedAgGrid from '@/components/shared/themed-ag-grid';
import { createColumnDefinitions } from "./partials/columnDefinitions";
import { submitExcelExport , submitPdfExport} from "./partials/exportHelpers";
import { FileText, Settings, Download, Plus, Users, BarChart3 } from 'lucide-react';
import NameCellRenderer from './partials/NameCellRenderer';
import { toast } from "sonner";
ModuleRegistry.registerModules([AllEnterpriseModule]);

interface PageProps {
  people: any[];
  columns: string[];
}

export default function ReportView() {
  const { people, columns,flash } = usePage().props as { 
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
    if (gridApi) {
      gridApi.sizeColumnsToFit();
    }
  }, [gridApi, people]);

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

  const handleExcelExport = () => {
    submitExcelExport();
  };

  const handlePdfExport = () => {
    submitPdfExport();
  };

  return (
    <AppLayout breadcrumbs={[{ title: "عرض التقرير" }]}>
      <Head title="عرض التقرير" />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    
      
      <div className="container mx-auto py-3 max-w-7xl">
        {/* Header */}
      <div className="max-w-7xl mx-auto p-1">
        <div className="flex overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8" dir="rtl">
          <div className="flex space-x-1 min-w-max">
                    <Link href={route('people.create')}>
                <Button 

                  size="sm"
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                <Plus className="w-4 h-4 mr-0" /> 
                        إضافة شخص جديد</Button>
                    </Link>
              <Link href={route('people.report.setup')}>
                <Button 

                  size="sm"
                  className="border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  تعديل الإعدادات
                </Button>
              </Link>
              
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

        {/* Stats Cards */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-1 mb-2 px-1 ">
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
                <p className="text-sm font-bold text-gray-900">{columns.length}</p>
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
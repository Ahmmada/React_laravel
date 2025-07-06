import { Head, usePage, Link } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";


import { ModuleRegistry } from 'ag-grid-community'; 
import { AllEnterpriseModule } from 'ag-grid-enterprise';

// Register all Community and Enterprise features
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { AgGridReact } from "ag-grid-react";
import { getStudentColumns } from "./partials/Columns";

import { exportCSV, exportExcel, exportPDF } from "./partials/Exporters";
import ExportDropdown from "./partials/ExportDropdown";
// Register all Community features
 // ModuleRegistry.registerModules([AllCommunityModule]);


import { Student } from "./partials/Types";
import { AG_GRID_LOCALE_EG } from "@/locales/ar.ts";


export default function StudentsIndex() {
  const { students, flash } = usePage().props as {
    students: Student[];
    flash?: { success?: string };
  };

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

  const gridRef = useRef<AgGridReact>(null);

 const [columnDefs] = useState(() => getStudentColumns());

 
  const rowData = useMemo(() => students, [students]);

  return (
    <AppLayout breadcrumbs={[{ title: "قائمة الطلاب", href: "/students" }]}>
      <Head title="قائمة الطلاب" />
      <div className="p-2 flex justify-between items-center mb-4">
        <Link href="/students/create">
          <Button className="dark:bg-gray-600 text-white" >إضافة طالب جديد</Button>
        </Link>
<ExportDropdown
  onExport={(type) => {
    if (type === "csv") exportCSV(gridRef);
    else if (type === "excel") exportExcel(gridRef);
    else if (type === "pdf") exportPDF(gridRef);
  }}
/>

      </div>

      <Card className="p-2 rounded-lg shadow-sm">
        <div
          className="ag-theme-quartz"
          style={{
            height: "calc(80vh - 120px)",
            width: "100%",
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={20}

            suppressCellFocus={true}
            suppressMovableColumns={true}
            rowHeight={40}
            headerHeight={45}
            enableRtl={true}
   localeText={AG_GRID_LOCALE_EG}
          />
        </div>
      </Card>
    </AppLayout>
  );
}
// resources/js/pages/teacher_attendance/partials/TeacherAttendanceTable.tsx
import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AgGridReact } from "ag-grid-react";
import ThemedAgGrid from "@/components/shared/themed-ag-grid";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { registerArabicFont } from "@/lib/arabicFont";
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([AllEnterpriseModule]);

interface TeacherAttendanceTableProps {
  attendanceData: any[];
  dates: string[];
  from_date: string;
  to_date: string;
  group_name: string;
}

export default function TeacherAttendanceTable({
  attendanceData,
  dates,
  from_date,
  to_date,
  group_name,
}: TeacherAttendanceTableProps) {
  const gridRef = useRef<AgGridReact>(null);

  const columnDefs = useMemo(() => {
    const baseCols = [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        width: 50,
        pinned: "right",
        suppressHeaderMenuButton: true,
        colId: "rowIndex",
      },
      {
        headerName: "الاسم",
        field: "name",
        filter: true, 
        flex: 1,
        width: 150,
        minWidth: 150,
        colId: "name",
      },
    {
      headerName: "المجموعة",
      field: "group",
      flex: 1,
      width: 150,
      minWidth: 150,
      filter: true,
      suppressHeaderMenuButton: true,
      colId: "group",
    },
    ];

const dateCols = dates.map((date) => {
  const d = new Date(date);
  const arabicDay = d.toLocaleDateString("ar-EG", { weekday: "short" });
  const enDate = d.toLocaleDateString("en", { day: "2-digit", month: "2-digit" });

  return {
    headerName: `${arabicDay}\n${enDate}`, // دعم سطرين داخل رأس العمود
    field: `records.${date}`,
    width: 90,
    cellStyle: { textAlign: "center", whiteSpace: "pre-line" }, // لدعم السطرين
    suppressHeaderMenuButton: true,
    colId: `date_${date}`,
  };
});
    const totalCol = [
      {
        headerName: "إجمالي الوقت",
        field: "total_minutes",

valueGetter: (params) => {
  if (!params.data) return null;
  const min = params.data.total_minutes;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
},
          
        width: 140,
        suppressHeaderMenuButton: true,
        colId: "total_minutes",
      },
{
  headerName: "المستحقات",
  field: "total_payment",
  aggFunc: "sum", // ✅ هذا يحسب المجموع
  valueFormatter: (params: any) => {
    const value = params.value;
    return value
      ? `${value.toLocaleString("en-US", { maximumFractionDigits: 0 })} ريال`
      : "-";
  },
  width: 120,
  suppressHeaderMenuButton: true,
  colId: "total_payment",
}
    ];

    return [...baseCols, ...dateCols, ...totalCol];
  }, [dates]);

  const exportExcel = () => {
    if (!gridRef.current || !gridRef.current.api) return toast.error("لا يمكن الوصول للجدول");

    const rows: any[] = [];
    gridRef.current.api.forEachNodeAfterFilterAndSort((node) => rows.push(node.data));

    if (rows.length === 0) return toast.error("لا توجد بيانات حالياً للتصدير");

    const allDisplayedCols = gridRef.current.api.getAllDisplayedColumns();
    const visibleDefs = allDisplayedCols.map((col) => col.getColDef());

    const formattedRows = rows.map((rowData, index) => {
      const row: Record<string, any> = {};
      visibleDefs.forEach((def) => {
        let val = "";
        if (def.colId === "rowIndex") val = index + 1;
        else if (def.field?.startsWith("records.")) {
          const dateKey = def.field.split(".")[1];
          val = rowData.records[dateKey] || "-";
        } else if (def.field === "total_minutes") {
          const min = rowData.total_minutes;
          val = `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;
        } else if (def.field) {
          val = rowData[def.field];
        }
        row[def.headerName || def.colId || def.field || ""] = val;
      });
      return row;
    });

    const sheet = XLSX.utils.json_to_sheet(formattedRows);
    sheet["!rightToLeft"] = true;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "تقرير المدرسين");
    XLSX.writeFile(wb, `تقرير المدرسين - ${from_date} إلى ${to_date}.xlsx`);
  };

  const exportPDF = () => {
    if (!gridRef.current || !gridRef.current.api) return toast.error("لا يمكن الوصول للجدول");

    const rows: any[] = [];
    gridRef.current.api.forEachNodeAfterFilterAndSort((node) => rows.push(node.data));

    if (rows.length === 0) return toast.error("لا توجد بيانات حالياً للتصدير");

    const doc = new jsPDF({ orientation: "landscape" });
    registerArabicFont(doc);
    doc.setFont("Amiri");
    doc.setFontSize(14);
const formatDate = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}-${m}-${y}`;
};

const title = `تقرير حضور المدرسين من ${formatDate(from_date)} إلى ${formatDate(to_date)}`;
    doc.text(title, doc.internal.pageSize.getWidth() - 10, 15, { align: "right" });

    const allDisplayedCols = gridRef.current.api.getAllDisplayedColumns();
    const visibleDefs = allDisplayedCols.map((col) => col.getColDef());

    const headRow = visibleDefs.map((def) => def.headerName || def.field || "").reverse();
    const body = rows.map((row, i) => {
      return visibleDefs.map((def) => {
if (def.colId === "rowIndex") return i + 1;

if (def.field?.startsWith("records.")) {
  const date = def.field.split(".")[1];
  return row.records[date] || "-";
}

if (def.field === "total_minutes") {
  const min = row.total_minutes;
  return `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;
}

if (def.field === "total_payment") {
  const pay = row.total_payment;
  return `  ${pay.toLocaleString("en", { maximumFractionDigits: 0 })} Ry `}

return def.field ? row[def.field] : "";
      }).reverse();
    });
// 1. احسب إجمالي الأجرة
const totalPayment = rows.reduce((sum, row) => {
  return sum + (row.total_payment || 0);
}, 0);

// 2. بناء صف التذييل
const footRow = visibleDefs.map((colDef) => {
  if (colDef.field === "total_payment") {
    return `  ${totalPayment.toLocaleString("en-US", { maximumFractionDigits: 0 })} Ry `;
  }
  return ""; // بقية الأعمدة تكون فارغة
}).reverse(); // لا تنسى لأن الأعمدة معكوسة

autoTable(doc, {
  head: [headRow],
  body,
  foot: [footRow], // ✅ هنا الإضافة
  startY: 25,
  styles: {
    font: "Amiri",
    fontStyle: "normal",
    fontSize: 10,
    halign: "right",
  },
  headStyles: {
    fillColor: [220, 220, 220],
    textColor: "#000",
  },
  footStyles: {
    fillColor: [245, 245, 245],
    textColor: "#000",
    fontStyle: "normal",
  },
});
    doc.save(`تقرير المدرسين - ${from_date} إلى ${to_date}.pdf`);
  };

const grandTotalRow = 'bottom';
  return (
    <>
      <div className="flex justify-between items-center mb-4 p-2">
        <h2 className="text-md font-bold">تقرير حضور المدرسين - {group_name}</h2>
        <div className="flex gap-2">
          <Button onClick={exportExcel}>📥 تصدير Excel</Button>
          <Button onClick={exportPDF}>📄 تصدير PDF</Button>
        </div>
      </div>

      <div className="ag-theme-quartz">
        <ThemedAgGrid
          ref={gridRef}
          rowData={attendanceData}
          columnDefs={columnDefs}
          pagination
          paginationPageSize={50}
          enableRtl
          suppressMovableColumns
          grandTotalRow={grandTotalRow} 
        />
      </div>
    </>
  );
}
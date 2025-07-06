import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AgGridReact } from "ag-grid-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { registerArabicFont } from "@/lib/arabicFont.js"; // تأكد من أن هذا المسار صحيح
import { toast } from "sonner";
import { ModuleRegistry } from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import ThemedAgGrid from "@/components/shared/themed-ag-grid";

ModuleRegistry.registerModules([AllEnterpriseModule]);

interface AttendanceTableProps {
    attendanceData: any[];
    dates: string[];
    from_date: string;
    to_date: string;
}

export default function AttendanceTable({ attendanceData, dates, from_date, to_date }: AttendanceTableProps) {
    const gridRef = useRef<AgGridReact>(null); // تحديد نوع الـ ref بشكل أدق

    const columns = useMemo(() => {
        const fixedCols = [
            { headerName: "#", valueGetter: "node.rowIndex + 1", width: 50, suppressHeaderMenuButton: true, pinned: 'right', colId: "rowIndex" },
            { headerName: "الاسم", field: "name", filter: true, flex: 1, sortable: true, minWidth: 150, colId: "name" },
            { headerName: "المركز", field: "center", filter: true, flex: 1, sortable: true, minWidth: 100, suppressHeaderMenuButton: true, colId: "center" },
            { headerName: "المستوى", field: "level", filter: true, flex: 1, sortable: true, minWidth: 120, suppressHeaderMenuButton: true, colId: "level" },
        ];

        const dateCols = dates.map((date) => ({
            headerName: new Date(date).toLocaleDateString("en", { month: "2-digit", day: "2-digit" }),
            field: `records.${date}`,
            width: 80,
            suppressHeaderMenuButton: true,
            cellStyle: { textAlign: "center" },
            colId: `record_${date}`,
        }));

        const summaryCols = [
            { headerName: "حاضر", field: "present", width: 80, suppressHeaderMenuButton: true, colId: "present" },
            { headerName: "غائب", field: "absent", width: 80, suppressHeaderMenuButton: true, colId: "absent" },
            { headerName: "مستأذن", field: "excused", width: 80, suppressHeaderMenuButton: true, colId: "excused" },
        ];

        return [...fixedCols, ...dateCols, ...summaryCols];
    }, [dates]);

    // ✅ Excel Export - Modified to export visible columns
    const handleExportExcel = () => {
        if (!gridRef.current || !gridRef.current.api) {
            toast.error("حدث خطأ: لا يمكن الوصول إلى بيانات الجدول.");
            return;
        }

        const filteredAndSortedData: any[] = [];
        gridRef.current.api.forEachNodeAfterFilterAndSort((node: any) => {
            filteredAndSortedData.push(node.data);
        });

        if (filteredAndSortedData.length === 0) {
            toast.error("لا توجد صفوف مطابقة حالياً للتصدير");
            return;
        }

        const allDisplayedColumns = gridRef.current.api.getAllDisplayedColumns();
        const visibleColumnDefs = allDisplayedColumns.map(col => col.getColDef());

        const rows = filteredAndSortedData.map((rowData, rowIndex) => {
            const rowOutput: { [key: string]: any } = {};
            visibleColumnDefs.forEach(colDef => {
                const headerName = colDef.headerName || colDef.field;
                let value;

                if (colDef.colId === "rowIndex") {
                    value = rowIndex + 1;
                } else if (colDef.field && colDef.field.startsWith("records.")) {
                    const dateKey = colDef.field.split('.')[1];
                    const status = rowData.records[dateKey];
                    value = status === "✔️" ? "حاضر" : status === "❌" ? "غائب" : status === "⏳" ? "مستأذن" : "-";
                } else {
                    if (colDef.field) {
                        value = rowData[colDef.field];
                    } else if (colDef.valueGetter) {
                        const params = {
                            data: rowData,
                            node: gridRef.current?.api.getRowNode(rowData.id || rowIndex), // Use optional chaining
                            colDef: colDef,
                            column: allDisplayedColumns.find(c => c.getColDef() === colDef),
                            api: gridRef.current?.api,
                            columnApi: gridRef.current?.columnApi
                        };
                        if (typeof colDef.valueGetter === 'function') {
                            value = colDef.valueGetter(params);
                        }
                    } else {
                        value = "";
                    }
                }
                rowOutput[headerName as string] = value; // Type assertion for headerName
            });
            return rowOutput;
        });

        const worksheet = XLSX.utils.json_to_sheet(rows);
        worksheet['!rightToLeft'] = true;
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "تقرير الحضور");
        XLSX.writeFile(workbook, `تقرير الحضور ${from_date} - ${to_date}.xlsx`);
    };

    // ✅ PDF Export - Modified to export visible columns and reverse their order
    const handleExportPDF = () => {
        if (!gridRef.current || !gridRef.current.api) {
            toast.error("حدث خطأ: لا يمكن الوصول إلى بيانات الجدول.");
            return;
        }

        const filteredAndSortedData: any[] = [];
        gridRef.current.api.forEachNodeAfterFilterAndSort((node: any) => {
            filteredAndSortedData.push(node.data);
        });

        if (filteredAndSortedData.length === 0) {
            toast.error("لا توجد صفوف مطابقة حالياً للتصدير");
            return;
        }

        const doc = new jsPDF({ orientation: "landscape", format: "a4" });
        registerArabicFont(doc);
        doc.setFont("Amiri");
        doc.setFontSize(18);

        const title = `تقرير الحضور من ${from_date} إلى ${to_date}`;
        const pageWidth = doc.internal.pageSize.getWidth();
        doc.text(title, pageWidth - 15, 15, { align: "right" });

        // 1. الحصول على الأعمدة المرئية بترتيبها الحالي (من اليسار لليمين افتراضياً)
        const allDisplayedColumns = gridRef.current.api.getAllDisplayedColumns();
        const visibleColumnDefs = allDisplayedColumns.map(col => col.getColDef());

        // 2. بناء رأس الجدول (head) ثم عكسه
        const headRow = visibleColumnDefs.map(colDef => {
            if (colDef.colId && colDef.colId.startsWith('record_') && colDef.field) {
                const dateKey = colDef.field.split('.')[1];
                return new Date(dateKey).toLocaleDateString("en", { month: "2-digit", day: "2-digit" });
            }
            return colDef.headerName || colDef.field || '';
        });
        const head = [headRow.reverse()]; //  ***** عكس رأس الجدول هنا  *****

        // 3. بناء جسم الجدول (body) ثم عكس كل صف
        const body = filteredAndSortedData.map((rowData, rowIndex) => {
            const rowCells = visibleColumnDefs.map(colDef => {
                if (colDef.colId === "rowIndex") {
                    return rowIndex + 1;
                } else if (colDef.field && colDef.field.startsWith("records.")) {
                    const dateKey = colDef.field.split('.')[1];
                    const status = rowData.records[dateKey];
                    return status === "✔️" ? "حاضر" : status === "❌" ? "غائب" : status === "⏳" ? "مستأذن" : "-";
                } else if (colDef.field) {
                    return rowData[colDef.field];
                } else {
                    // Fallback for valueGetter if needed, though direct field access is preferred for data cells
                    return gridRef.current?.api.getValue(colDef, rowData);
                }
            });
            return rowCells.reverse(); //  ***** عكس خلايا كل صف هنا  *****
        });

        autoTable(doc, {
            head,
            body,
            startY: 25,
            styles: {
                font: "Amiri",
                fontStyle: "normal",
                fontSize: 10,
                halign: "right", // هذا مهم للمحاذاة داخل الخلايا
                cellPadding: 2,
            },
            headStyles: {
                fillColor: [230, 230, 230],
                textColor: "#000",
            },
            didParseCell: function (data) {
                const cellText = data.cell.raw;

                if (cellText === "حاضر") {
                    data.cell.styles.textColor = "#2e7d32";
                } else if (cellText === "غائب") {
                    data.cell.styles.textColor = "#c62828";
                } else if (cellText === "مستأذن") {
                    data.cell.styles.textColor = "#f9a825";
                }
            },
            didDrawPage: () => {
                doc.setFont("Amiri");
            },
        });
        doc.save(`تقرير الحضور ${from_date} - ${to_date}.pdf`);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4 p-2">
                <h2 className="text-md font-bold">تقرير حضور الطلاب من {from_date} إلى {to_date}</h2>
                <div className="flex gap-2">
                    <Button  onClick={handleExportExcel}>📥 تصدير Excel</Button>
                    <Button onClick={handleExportPDF}>📄 تصدير PDF</Button>
                </div>
            </div>

            <div className="ag-theme-quartz" >
            <ThemedAgGrid
                    ref={gridRef}
                    rowData={attendanceData}
                    columnDefs={columns}
                    suppressMovableColumns
                    enableRtl={true}
                    defaultColDef={{ sortable: false, resizable: true }} // إضافة resizable للسماح بتغيير حجم الأعمدة

                    pagination={true}
                    paginationPageSize={50}
                />
            </div>
        </>
    );
}

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { registerArabicFont } from "@/lib/arabicFont.js";

export const getTimestamp = () => {
  const now = new Date();
  const date = now.toLocaleDateString("sv").replace(/-/g, "_");
  const time = now.toTimeString().slice(0, 5).replace(/:/g, "-");
  return `${date}_${time}`;
};

export const exportCSV = (gridRef: any) => {
  if (!gridRef.current) return;

  const filteredData: any[] = [];
  gridRef.current.api.forEachNodeAfterFilterAndSort((node: any) => {
    filteredData.push(node.data);
  });

  if (filteredData.length === 0) {
    toast.error("لا توجد صفوف مطابقة حالياً للتصدير");
    return;
  }

  const exportedData = filteredData.map((row, index) => ({
    م: index + 1,
    الاسم: row.name,
    المركز: row.center?.name || "",
    المستوى: row.level?.name || "",
    "تاريخ الميلاد": row.birth_date,
    العنوان: row.address,
    "رقم الهاتف": row.phone,
    الملاحظات: row.notes,
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportedData);
  const csv = XLSX.utils.sheet_to_csv(worksheet, { FS: "," });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const filename = `students_${getTimestamp()}.csv`;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportExcel = (gridRef: any) => {
  if (!gridRef.current) return;

  const filteredData: any[] = [];
  gridRef.current.api.forEachNodeAfterFilterAndSort((node: any) => {
    filteredData.push(node.data);
  });

  const exportedData = filteredData.map((row, index) => ({
    م: index + 1,
    الاسم: row.name,
    المركز: row.center?.name || "",
    المستوى: row.level?.name || "",
    "تاريخ الميلاد": row.birth_date,
    العنوان: row.address,
    "رقم الهاتف": row.phone,
    الملاحظات: row.notes,
  }));

  if (exportedData.length === 0) {
    toast.error("لا توجد صفوف مطابقة حالياً للتصدير");
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(exportedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "الطلاب");
  XLSX.writeFile(workbook, `students_${getTimestamp()}.xlsx`);
};

export const exportPDF = (gridRef: any) => {
  if (!gridRef.current) return;

  const filteredData: any[] = [];
  gridRef.current.api.forEachNodeAfterFilterAndSort((node: any) => {
    filteredData.push(node.data);
  });

  if (filteredData.length === 0) {
    toast.error("لا توجد صفوف مطابقة حالياً للتصدير");
    return;
  }

  const doc = new jsPDF({ orientation: "landscape", format: "a4" });
  registerArabicFont(doc);

  autoTable(doc, {
    head: [["الملاحظات", "تاريخ الميلاد", "المستوى", "المركز", "الاسم", "م"]],
    body: filteredData.map((row, index) => [
      row.notes,
      row.birth_date,
      row.level?.name ?? "",
      row.center?.name ?? "",
      row.name,
      index + 1,
    ]),
    styles: {
      font: "Amiri",
      fontStyle: "normal",
      fontSize: 12,
      halign: "right",
    },
    margin: { top: 20 },
  });

  doc.save(`students_${getTimestamp()}.pdf`);
};
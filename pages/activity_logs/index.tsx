import { useEffect, useMemo, useState, useCallback } from "react"; // أضف useCallback
import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community"; // أضف ColDef
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ThemedAgGrid from "@/components/shared/themed-ag-grid";

ModuleRegistry.registerModules([AllCommunityModule]);

type Log = {
  id: number;
  description: string;
  created_at: string;
  causer?: {
    name: string;
  };
  properties: Record<string, any>;
};

// تعريف نقطة التوقف للشاشة الصغيرة
const MOBILE_BREAKPOINT = 768; // على سبيل المثال، 768px هو breakpoint الشائع للأجهزة اللوحية الصغيرة / الهواتف

export default function ActivityLogPage() {
  const { logs, flash } = usePage().props as {
    logs: Log[];
    flash?: { success?: string; errors?: any };
  };

  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [showClearAll, setShowClearAll] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Log | null>(null);

  // حالة لتتبع ما إذا كنا على شاشة محمولة
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);

  // useEffect لمراقبة حجم الشاشة وتحديث حالة isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

  // تعريف الأعمدة الأساسية (التي لا تعتمد على حجم الشاشة)
  const baseColumns: ColDef[] = useMemo(
    () => [
      {
        headerName: "#",
        field: "id",
        width: 70,
        sortable: true,
        filter: true,
        minWidth: 50, // ضمان عرض أدنى
      },
      {
        headerName: "العملية",
        field: "description",
        flex: 1, // سنغير هذا في الأعمدة المخصصة للموبايل
        filter: true,
        minWidth: 150, // ضمان عرض أدنى للوصف
      },
      {
        headerName: "المستخدم",
        field: "causer.name",
        flex: 1, // سنغير هذا في الأعمدة المخصصة للموبايل
        valueGetter: (params: any) => params.data.causer?.name || "النظام",
        filter: true,
        minWidth: 120, // ضمان عرض أدنى للمستخدم
      },
      {
        headerName: "التاريخ",
        field: "created_at",
        width: 180,
        sortable: true,
        filter: true,
        minWidth: 160, // ضمان عرض أدنى للتاريخ
        valueFormatter: (params: any) =>
          params.value
            ? new Date(params.value).toLocaleString("ar-EG", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
      },
      {
        headerName: "الإجراءات",
        field: "actions",
        width: 200,
        minWidth: 150, // ضمان عرض أدنى للإجراءات
        cellRenderer: (params: any) => (
                 <div className="flex gap-2 items-center h-full">
          
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLog(params.data)}
              aria-label={`عرض تفاصيل السجل رقم ${params.data.id}`}
            >
              التفاصيل
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteTarget(params.data)}
              aria-label={`حذف السجل رقم ${params.data.id}`}
            >
              حذف
            </Button>
          </div>
        ),
        sortable: false,
        filter: false,
        resizable: false,
      },
    ],
    []
  );

  // استخدام useMemo لتحديد الأعمدة النهائية بناءً على isMobile
  const columns = useMemo(() => {
    if (isMobile) {
      // أعمدة مخصصة للهاتف: عرض فقط الأعمدة الأساسية، مع تعديل flex أو width
      return [
        {
          headerName: "#",
          field: "id",
          width: 60, // عرض أصغر
          minWidth: 50,
        },
        {
          headerName: "العملية",
          field: "description",
          flex: 2, // أعط العملية مساحة أكبر
          minWidth: 180, // ضمان عرض أدنى أكبر
        },
        // يمكنك اختيار إخفاء أعمدة مثل "المستخدم" أو "التاريخ" إذا كانت الشاشة ضيقة جدًا
        // أو تقليل عرضها بشكل كبير
        {
          headerName: "المستخدم",
          field: "causer.name",
          flex: 1, // مساحة أقل للمستخدم
          minWidth: 100,
        },
        {
            headerName: "التاريخ",
            field: "created_at",
            width: 140, // عرض ثابت أصغر ليتناسب
            minWidth: 120,
            valueFormatter: (params: any) =>
                params.value
                  ? new Date(params.value).toLocaleDateString("ar-EG") // فقط التاريخ
                  : "",
        },
        {
          headerName: "الإجراءات",
          field: "actions",
          width: 150, // عرض أصغر للأزرار
          minWidth: 120,
          cellRenderer: (params: any) => (
                 <div className="flex gap-1 items-center h-full"> {/* تقليل المسافة بين الأزرار */}
              <Button
                variant="outline"
                size="xs" // استخدم حجم أصغر للأزرار إذا كان موجودًا في shadcn
                onClick={() => setSelectedLog(params.data)}
              >
                تفاصيل
              </Button>
              <Button
                variant="destructive"
                size="xs" // استخدم حجم أصغر للأزرار إذا كان موجودًا في shadcn
                onClick={() => setDeleteTarget(params.data)}
              >
                حذف
              </Button>
            </div>
          ),
          sortable: false,
          filter: false,
          resizable: false,
        },
      ];
    }
    // إذا لم يكن على الهاتف، استخدم الأعمدة الأساسية
    return baseColumns;
  }, [isMobile, baseColumns]); // يعتمد على isMobile و baseColumns

  const textRightClass = "text-right";
  const paragraphClass = "mb-1";

  return (
    <AppLayout title="سجل العمليات">
      <Head title="سجل العمليات" />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6 p-2">
        <h1 className="text-2xl font-bold text-gray-800">📜 سجل العمليات</h1>
        <Button
          variant="destructive"
          onClick={() => setShowClearAll(true)}
          className="shadow-sm"
        >
          حذف جميع السجلات
        </Button>
      </div>

      {/* AG-Grid Table */}

    <ThemedAgGrid
          rowData={logs}
          columnDefs={columns} // الآن الأعمدة تتغير ديناميكيًا
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
          }}
          enableRtl={true}
          pagination={true}
          paginationPageSize={15}
          paginationPageSizeSelector={[15, 30, 50 ,100]}
        />
  

      {/* --- Modals --- */}

      {/* Log Details Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-700 dark:text-white">
          <DialogHeader>
            <DialogTitle className={textRightClass}>
              تفاصيل السجل #{selectedLog?.id}
            </DialogTitle>
            <DialogDescription className={`sr-only ${textRightClass}`}>
              عرض تفاصيل السجل المحدد، بما في ذلك العملية والمستخدم والخصائص.
            </DialogDescription>
          </DialogHeader>

          <div className={`grid gap-2 py-4 ${textRightClass}`}>
            <p className={paragraphClass}>
              <span className="font-semibold">العملية:</span>{" "}
              <strong>{selectedLog?.description || "غير متوفر"}</strong>
            </p>
            <p className={paragraphClass}>
              <span className="font-semibold">المستخدم:</span>{" "}
              <strong>{selectedLog?.causer?.name ?? "النظام"}</strong>
            </p>
            <p className={paragraphClass}>
              <span className="font-semibold">التاريخ:</span>{" "}
              <strong>
                {selectedLog?.created_at
                  ? new Date(selectedLog.created_at).toLocaleString("ar-EG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "غير متوفر"}
              </strong>
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-600 dark:text-white p-4 rounded-md border border-gray-200">
            <h4 className={`font-semibold mb-2 ${textRightClass} text-gray-700 dark:text-white`}>
              الخصائص:
            </h4>
            <pre className="max-h-60 overflow-y-auto text-sm text-right whitespace-pre-wrap font-mono leading-relaxed">
              {selectedLog?.properties &&
              Object.keys(selectedLog.properties).length > 0
                ? JSON.stringify(selectedLog.properties, null, 2)
                : "لا توجد خصائص إضافية لهذا السجل."}
            </pre>
          </div>

          <DialogFooter className="flex justify-end mt-4">
            <Button variant="secondary" onClick={() => setSelectedLog(null)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Single Log Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className={textRightClass}>تأكيد حذف السجل</DialogTitle>
            <DialogDescription className={textRightClass}>
              هل أنت متأكد أنك تريد حذف السجل رقم{" "}
              <strong>{deleteTarget?.id}</strong> الخاص بالعملية "
              {deleteTarget?.description}"؟
              <br />
              <span className="font-semibold text-red-600">
                لا يمكن التراجع عن هذا الإجراء.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                router.delete(route("activityLogs.delete", deleteTarget!.id), {
                  onSuccess: () => {
                    toast.success("تم حذف السجل بنجاح.");
                    setDeleteTarget(null);
                  },
                  onError: (error) => {
                    toast.error(
                      "حدث خطأ أثناء حذف السجل: " +
                        (error.message || "الرجاء المحاولة مرة أخرى.")
                    );
                  },
                });
              }}
            >
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Clear All Logs Modal */}
      <Dialog open={showClearAll} onOpenChange={setShowClearAll}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className={textRightClass}>
              تأكيد حذف جميع السجلات
            </DialogTitle>
            <DialogDescription className={textRightClass}>
              ⚠️ هل أنت متأكد أنك تريد حذف{" "}
              <strong>جميع سجلات العمليات؟</strong>
              <br />
              <span className="font-semibold text-red-600">
                هذا الإجراء سيحذف جميع السجلات بشكل دائم ولا يمكن التراجع عنه.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => setShowClearAll(false)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                router.delete(route("activityLogs.clear"), {
                  onSuccess: () => {
                    toast.success("تم حذف جميع السجلات بنجاح.");
                    setShowClearAll(false);
                  },
                  onError: (error) => {
                    toast.error(
                      "حدث خطأ أثناء حذف جميع السجلات: " +
                        (error.message || "الرجاء المحاولة مرة أخرى.")
                    );
                  },
                });
              }}
            >
              حذف الكل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

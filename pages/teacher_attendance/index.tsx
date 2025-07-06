// resources/js/pages/teacher_attendance/index.tsx
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { toast } from "sonner";
import { AG_GRID_LOCALE_EG } from "@/locales/ar";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

ModuleRegistry.registerModules([AllCommunityModule]);

type TeacherAttendance = {
  id: number;
  attendance_date: string;
  group?: { name: string };
  teachers: { id: number }[]; // just count from this
};

export default function TeacherAttendanceIndex() {
  const { attendances, flash } = usePage().props as {
    attendances: TeacherAttendance[];
    flash?: { success?: string; error?: string };
  };

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "#",
        valueGetter: (params: any) => params.node.rowIndex + 1,
        width: 50,
      },
      {
        headerName: "التاريخ",
        field: "attendance_date",
        flex: 1,
        minWidth: 120 ,
      },
      {
        headerName: "المجموعة",
        field: "group.name",
        flex: 1,
        minWidth: 150 ,
        valueGetter: (params: any) => params.data.group?.name || "غير محدد",
      },
      {
        headerName: "العدد ",
        valueGetter: (params: any) => params.data.teachers.length,
        flex: 1,
        minWidth: 120 ,
      },
      {
        headerName: "إجراءات",
        field: "id",
        cellRenderer: (params: any) => {
          const id = params.value;

          return (
            <div className="flex gap-2 items-center h-full">
              <Button size="xs" variant="secondary" onClick={() => router.get(`/teacher_attendance/${id}`)}>
                عرض
              </Button>
              <Button size="xs" variant="info" onClick={() => router.get(`/teacher_attendance/${id}/edit`)}>
                تعديل
              </Button>
              <Dialog open={open && deleteId === id} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="xs" variant="destructive" onClick={() => {
                    setDeleteId(id);
                    setOpen(true);
                  }}>
                    حذف
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>تأكيد الحذف</DialogTitle>
                    <DialogDescription>هل أنت متأكد من حذف هذه الوثيقة؟</DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                    <Button variant="destructive" onClick={() => {
                      if (deleteId) {
                        router.delete(`/teacher_attendance/${deleteId}`, {
                          onSuccess: () => {
                            setOpen(false);
                            toast.success("تم حذف الوثيقة بنجاح");
                          },
                          onError: () => {
                            toast.error("فشل حذف الوثيقة");
                          },
                        });
                      }
                    }}>
                      حذف
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        },
      },
    ],
    [deleteId, open]
  );

  return (
    <AppLayout breadcrumbs={[{ title: "سجلات الحضور", href: "/teacher_attendance" }]}>
      <Head title="سجلات الحضور - المعلمين" />

      <div className="p-2 mb-4 flex justify-between items-center">
        <div className="flex gap-2">

          <Button onClick={() => router.visit("/teacher_attendance/create")}>
            إنشاء وثيقة حضور جديدة
          </Button>
             </div>     
          <Button variant="secondary" onClick={() => router.get("/teacher_attendance/report/form")}>
            تقارير الحضور
          </Button>
          

      </div>

      <Card className="p-0">
        <div className="ag-theme-quartz" style={{ height: 500, width: "100%" }}>
          {attendances.length > 0 ? (
            <AgGridReact
              rowData={attendances}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={20}
              domLayout="autoHeight"
              suppressMovableColumns={true}
              enableRtl={true}
              localeText={AG_GRID_LOCALE_EG}
            />
          ) : (
            <div className="p-4 text-center text-yellow-600 font-medium">
              لا توجد أي وثائق تحضير حتى الآن.
            </div>
          )}
        </div>
      </Card>
    </AppLayout>
  );
}
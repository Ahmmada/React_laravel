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

// AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

type Attendance = {
  id: number;
  attendance_date: string;
  center: { name: string };
  level: { name: string };
};

export default function AttendancesIndex() {
  const { attendances, flash } = usePage().props as {
    attendances: Attendance[];
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
        headerName: "التاريخ",
        field: "attendance_date",
        flex: 1,
        minWidth: 120 ,
      },
      {
        headerName: "المركز",
        field: "center.name",
        flex: 1,
        minWidth: 100 ,
        valueGetter: (params: any) => params.data.center?.name,
      },
      {
        headerName: "المستوى",
        field: "level.name",
        flex: 1,
        minWidth: 120 ,
        valueGetter: (params: any) => params.data.level?.name,
      },
      {
        headerName: "خيارات",
        field: "id",
        cellRenderer: (params: any) => {
          const id = params.value;

          return (
            <div className="flex gap-2 items-center h-full">
              <Button size="xs" variant="secondary" onClick={() => router.get(`/attendances/${id}`)}>
                عرض
              </Button>
              <Button size="xs" variant="info" onClick={() => router.get(`/attendances/${id}/edit`)}>
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
                    <DialogDescription>هل تريد حذف هذه الوثيقة؟</DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
                    <Button variant="destructive" onClick={() => {
                      if (deleteId) {
                        router.delete(`/attendances/${deleteId}`, {
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
    <AppLayout breadcrumbs={[{ title: "سجلات الحضور", href: "/attendances" }]}>
      <Head title="سجلات الحضور" />

      <div className=" p-2 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"> </h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.get("/attendance-report/all")}>
            تقارير الحضور 1
          </Button>
          <Button variant="secondary" onClick={() => router.get("/attendance-report")}>
            تقارير الحضور 2
          </Button>
          <Button onClick={() => router.get("/attendances/create")}>
            إنشاء وثيقة حضور جديدة
          </Button>
        </div>
      </div>

      <Card className="p-0">
        <div
          className="ag-theme-quartz"
          style={{ height: 500, width: "100%" }}
        >
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
        </div>
      </Card>
    </AppLayout>
  );
}

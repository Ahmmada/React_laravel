import { Head, usePage, router } from "@inertiajs/react";
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

type Permission = {
  id: number;
  name: string;
};

export default function PermissionsIndex() {
  const { permissions, flash } = usePage().props as {
    permissions: {
      data: Permission[];
      links: any[];
      meta: any;
    };
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
        headerName: "م",
        valueGetter: "node.rowIndex + 1",
        suppressHeaderMenuButton: true,
        width: 80,
      },
      {
        headerName: "اسم الإذن",
        field: "name",
        filter: true,
        suppressHeaderMenuButton: true,
        flex: 1,
      },
      {
        headerName: "الإجراءات",
        field: "id",
        suppressHeaderMenuButton: true,
        cellRenderer: (params: any) => {
          const id = params.value;

          return (
            <div className="flex gap-2 items-center h-full">

              <Button
                size="xs"
                variant="outline"
                onClick={() => router.get(`/permissions/${id}/edit`)}
              >
                تعديل
              </Button>
              <Dialog open={open && deleteId === id} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="xs"
                    variant="destructive"
                    onClick={() => {
                      setDeleteId(id);
                      setOpen(true);
                    }}
                  >
                    حذف
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>تأكيد الحذف</DialogTitle>
                    <DialogDescription>
                      هل أنت متأكد أنك تريد حذف هذا الإذن؟ لا يمكن التراجع.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                      إلغاء
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (deleteId) {
                          router.delete(`/permissions/${deleteId}`, {
                            onSuccess: () => {
                              setOpen(false);
                              toast.success("تم حذف الإذن بنجاح");
                            },
                            onError: () => {
                              toast.error("حدث خطأ أثناء الحذف");
                            },
                          });
                        }
                      }}
                    >
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
    <AppLayout breadcrumbs={[{ title: "قائمة الأذونات", href: "/permissions" }]}>
      <Head title="إدارة الأذونات" />
      <div className=" p-2 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">الأذونات</h1>
        <Button onClick={() => router.get("/permissions/create")}>
          + إنشاء إذن جديد
        </Button>
      </div>

      <Card className="p-0">
        <div
          className="ag-theme-quartz"
          style={{ height: 500, width: "100%" }}
        >
          <AgGridReact
            rowData={permissions.data}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={20}
            enableRtl={true}
            localeText={AG_GRID_LOCALE_EG}
          />
        </div>
      </Card>
    </AppLayout>
  );
}
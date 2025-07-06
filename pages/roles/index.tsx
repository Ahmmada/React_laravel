import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { useEffect, useMemo, useState} from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import ThemedAgGrid from "@/components/shared/themed-ag-grid";
import usePermission from "@/hooks/usePermission"; // <--- 1. استيراد الـ hook هنا

type Role = {
  id: number;
  name: string;
};

export default function RolesIndex() {
  const { roles, flash } = usePage().props as {
    roles: {
      data: Role[];
      links: any[];
      meta: any;
    };
    flash?: { success?: string };
  };

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

  // <--- 2. التحقق من الصلاحيات خارج useMemo للحصول على قيم ثابتة
  const canEditRoles = usePermission("تعديل الدور"); // افتراض صلاحية "تعديل الأدوار"
  const canDeleteRoles = usePermission("حذف الدور"); // افتراض صلاحية "حذف الأدوار"

  const columnDefs = useMemo(
    () => [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        suppressHeaderMenuButton: true,
        width: 70,
      },
      {
        headerName: "اسم الدور",
        field: "name",
        suppressHeaderMenuButton: true,
        flex: 1,
      },
      {
        headerName: "الإجراءات",
        field: "id",
        suppressHeaderMenuButton: true,
        cellRenderer: (params: any) => {
          const id = params.value;
          const [open, setOpen] = useState(false);

          const handleDelete = () => {
            router.delete(`/roles/${id}`, {
              onSuccess: () => {
                setOpen(false);
                toast.success("تم حذف الدور بنجاح");
              },
              onError: () => {
                toast.error("حدث خطأ أثناء حذف الدور");
              },
            });
          };

          return (
            <>
              <div className="flex gap-2 items-center h-full">
                {/* زر "عرض" عادة ما يكون متاحًا للجميع، أو يمكن إضافة صلاحية له أيضًا */}
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => router.get(`/roles/${id}`)}
                >
                  عرض
                </Button>

                {/* <--- 3. العرض الشرطي لزر "تعديل" */}
                {canEditRoles && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => router.get(`/roles/${id}/edit`)}
                  >
                    تعديل
                  </Button>
                )}

                {/* <--- 4. العرض الشرطي لزر "حذف" مع الـ Dialog */}
                {canDeleteRoles && (
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button size="xs" variant="destructive">
                        حذف
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تأكيد الحذف</DialogTitle>
                        <DialogDescription>
                          هل أنت متأكد من أنك تريد حذف هذا الدور؟ لا يمكن التراجع بعد الحذف.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          إلغاء
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                          حذف
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </>
          );
        },
      },
    ],
    [canEditRoles, canDeleteRoles] // <--- 5. إضافة الصلاحيات كـ dependencies للـ useMemo
  );

  return (
    <AppLayout breadcrumbs={[{ title: "الأدوار", href: "/roles" }]}>
      <Head title="إدارة الأدوار" />

      {/* يمكنك أيضًا إضافة صلاحية لزر "إنشاء دور جديد" هنا إذا لزم الأمر */}
      <div className="flex justify-between items-center mb-4 p-2">
        <h1 className="text-2xl font-bold">قائمة الأدوار</h1>
        {usePermission("اضافة دور") && ( // افتراض صلاحية "إنشاء الأدوار"
          <Button onClick={() => router.get("/roles/create")}>
            + إنشاء دور جديد
          </Button>
        )}
      </div>

      <Card>
        <ThemedAgGrid
          rowData={roles.data}
          columnDefs={columnDefs}
        />
      </Card>
    </AppLayout>
  );
}

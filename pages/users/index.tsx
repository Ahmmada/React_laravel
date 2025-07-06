import { Head, usePage, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

import ThemedAgGrid from "@/components/shared/themed-ag-grid"; // 👈 بدل ag-grid مباشرة

type User = {
  id: number;
  name: string;
  email: string;
  roles: { name: string }[];
};


export default function UsersIndex() {
  const { users, flash } = usePage().props as {
    users: User[];
    flash?: { success?: string };
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
  }, [flash]);

  const handleDelete = (id: number) => {
    router.delete(`/users/${id}`, {
      onSuccess: () => {
        toast.success("تم حذف المستخدم بنجاح");
        setConfirmDeleteId(null);
        setConfirmDeleteName("");
      },
      onError: () => toast.error("حدث خطأ أثناء الحذف"),
    });
  };



  const columnDefs = useMemo(
    () => [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        minWidth: 50,
        width: 50,
        suppressHeaderMenuButton: true,
        pinned: 'right'
      },
      {
        headerName: "الاسم",
        field: "name",
        filter: true,
        flex: 1,
        minWidth: 150 
      },
      {
        headerName: "البريد الإلكتروني",
        field: "email",
        flex: 1,
        suppressHeaderMenuButton: true,
        minWidth: 150 
      },
  {
        headerName: "الدور",
        field: "roles",
        suppressHeaderMenuButton: true,
        cellRenderer: (params: any) => {
          const roles = params.data.roles?.map((r: any) => r.name).join(", ");
          return <span className="text-green-600">{roles || "—"}</span>;
        },
      },
      {
        headerName: "الخيارات",
        field: "id",
        minWidth: 120,
        suppressHeaderMenuButton: true,
        cellRenderer: (params: any) => {
          const id = params.value;
          const name = params.data.name;
          return (
                 <div className="flex gap-2 items-center h-full">
              <Button
              variant="outline"
              size="xs"
                onClick={() => router.get(`/users/${id}/edit`)}
              >
                تعديل
              </Button>
              <Button
                size="xs"
                variant="destructive"
                onClick={() => {
                  setConfirmDeleteId(id);
                  setConfirmDeleteName(name);
                }}
              >
                حذف
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1, // اجعل الأعمدة تتمدد لتملأ المساحة
            minWidth: 100,
            suppressHeaderMenuButton: true,
            resizable: true,
        };
    }, []);

  return (
    <AppLayout breadcrumbs={[{ title: "المستخدمين", href: "/users" }]}>
      <Head title="قائمة المستخدمين" />
      <div className=" p-2 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">المستخدمين</h1>
        <Button onClick={() => router.get("/users/create")}>
          إنشاء مستخدم جديد
        </Button>
      </div>

<Card>
 
    <ThemedAgGrid
      rowData={users}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef} 
      paginationPageSize={20}

    />

</Card>

      {/* Dialog الحذف */}
      <Dialog
        open={confirmDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmDeleteId(null);
            setConfirmDeleteName("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد حذف المستخدم "{confirmDeleteName}"؟
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(confirmDeleteId!)}
            >
              تأكيد الحذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

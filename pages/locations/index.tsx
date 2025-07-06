import { Head, usePage, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

import ThemedAgGrid from "@/components/shared/themed-ag-grid";

type Location = {
  id: number;
  name: string;
};

export default function LocationsIndex() {
  const { locations, flash } = usePage().props as {
    locations: Location[];
    flash?: { success?: string; errors?: any };
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModalId, setShowEditModalId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.errors) toast.error("حدث خطأ أثناء العملية");
  }, [flash]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    router.post("/locations", { name }, {
      onSuccess: () => {
        setName("");
        setShowAddModal(false);
      },
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    router.put(`/locations/${editingId}`, { name }, {
      onSuccess: () => {
        setEditingId(null);
        setName("");
        setShowEditModalId(null);
      },
    });
  };


const handleDelete = (id: number) => {
  router.delete(`/locations/${id}`, {
    onSuccess: () => {
      toast.success(`تم حذف الحارة "${confirmDeleteName}"`, {
        action: {
          label: "تراجع",
          onClick: () => {
            router.post(`/locations/${id}/restore`);
          },
        },
      });
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء الحذف");
    },
  });
};
  
  const columnDefs = useMemo(() => [
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      width: 80,
    },
    {
      headerName: "اسم الحارة",
      field: "name",
      sortable: true,
      filter: true,
      flex: 1,
    },
{
  headerName: "الخيارات",
  field: "id",
  cellRenderer: (params: any) => {
    return (
      <div className="flex space-x-2 h-full items-center justify-center">
        <Button
          size="xs" 
          variant="secondary"
          onClick={() => {
            setEditingId(params.value);
            setName(params.data.name);
            setShowEditModalId(params.value);
          }}
        >
          تعديل
        </Button>
        
<Button
  size="xs" 
  variant="destructive"
  onClick={() => {
    setConfirmDeleteId(params.value);
    setConfirmDeleteName(params.data.name);
  }}
>
  حذف
</Button>
      </div>
    );
  },
},
  ], []);

  return (
    <AppLayout breadcrumbs={[{ title: "الحارات", href: "/locations" }]}>
      <Head title="قائمة الحارات" />

      <div className="p-2 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">الحارات</h1>
        <Button onClick={() => setShowAddModal(true)}>إضافة حارة جديد</Button>
      </div>

      <Card className="p-0">
    <ThemedAgGrid
            rowData={locations}
      columnDefs={columnDefs}


    />

      </Card>

      {/* Modal الإضافة */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleAdd}
            className="bg-white rounded-lg shadow p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-bold mb-4">إضافة حارة جديد</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="ادخل اسم الحارة"
              required
            />
            <div className="flex justify-end gap-2">
<Button
  variant="outline"
  onClick={() => {
    setShowAddModal(false);
    setName(""); // 🧼 إعادة تعيين
  }}
>
  إلغاء
</Button>
              <Button type="submit">إضافة</Button>
            </div>
          </form>
        </div>
      )}

      {/* Modal التعديل */}
      {showEditModalId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-lg shadow p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-bold mb-4">تعديل الحارة</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <div className="flex justify-end gap-2">
<Button
  variant="outline"
  onClick={() => {
    setShowEditModalId(null);
    setName(""); // 🧼 إعادة تعيين
    setEditingId(null);
  }}
>
  إلغاء
</Button>
              <Button type="submit">حفظ التعديلات</Button>
            </div>
          </form>
        </div>
      )}
         {/* Dialog تأكيد الحذف */}   

<Dialog open={confirmDeleteId !== null} onOpenChange={(open) => {
  if (!open) {
    setConfirmDeleteId(null);
    setConfirmDeleteName("");
  }
}}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>تأكيد الحذف</DialogTitle>
      <DialogDescription>
        هل أنت متأكد أنك تريد حذف الحارة "{confirmDeleteName}"؟ لا يمكن التراجع عن هذا الإجراء إلا بالضغط على "تراجع" بعد الحذف.
      </DialogDescription>
    </DialogHeader>
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>إلغاء</Button>
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

import React from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// تسجيل جميع ميزات المجتمع من AG-Grid
ModuleRegistry.registerModules([AllCommunityModule]);

import ThemedAgGrid from "@/components/shared/themed-ag-grid";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // تم التغيير من div إلى DialogFooter لدلالة أفضل وتصميم متناسق
} from "@/components/ui/dialog";
import { toast } from "sonner";

// تعريف نوع المعلم لسلامة أفضل للنوع
type Teacher = {
  id: number;
  name: string;
  group: { name: string };
  position: string;
  phone: string;
  address: string;
  birth_date: string;
  notes: string;
};

export default function TeacherIndex() {
  // فك خصائص الكائن من usePage للوصول الأسهل
const { teachers, flash, defaultHourlyRate } = usePage().props as {
  teachers: Teacher[];
  flash?: { success?: string };
  defaultHourlyRate: number;
};

  // حالة لإدارة أي مربع حوار حذف مفتوح. تخزن معرف المعلم المراد حذفه.
  const [openDialogId, setOpenDialogId] = React.useState<number | null>(null);

  // إظهار إشعار توست (toast) للنجاح إذا كانت هناك رسالة فلاش (flash message)
  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]); // مصفوفة التبعيات تضمن تشغيل هذا فقط عند تغيير flash

const [rateDialogOpen, setRateDialogOpen] = React.useState(false);
const [rate, setRate] = React.useState(defaultHourlyRate ?? 0);
const [loading, setLoading] = React.useState(false);

  // دالة لمعالجة حذف معلم
  const handleDelete = (id: number) => {
    router.delete(`/teachers/${id}`, {
      onSuccess: () => {
        setOpenDialogId(null); // إغلاق مربع الحوار عند الحذف بنجاح
        toast.success("تم حذف المعلم بنجاح");
      },
      onError: () => {
        setOpenDialogId(null); // إغلاق مربع الحوار حتى لو كان هناك خطأ
        toast.error("حدث خطأ أثناء حذف المعلم");
      },
    });
  };

  // تعريفات الأعمدة لـ AG-Grid
  const columnDefs = [
    {
      headerName: "م", // عنوان العمود
      valueGetter: "node.rowIndex + 1", // الحصول على قيمة الفهرس (رقم الصف)
      width: 50, // عرض العمود
      sortable: false, // عادة، أرقام الصفوف لا تحتاج إلى ترتيب
      filter: false, // وعادة لا يوجد فلترة
    },

    { headerName: "الاسم", field: "name",       width: 180,minWidth: 150  },
    { headerName: "المجموعة", field: "group.name",      width: 120, minWidth: 120 },
    { headerName: "الصفة", field: "position",       width: 100, minWidth: 100 },
    { headerName: "الهاتف", field: "phone" ,       width: 80, minWidth: 80  },
    { headerName: "العنوان", field: "address" ,     width: 80, minWidth: 80  },
    { headerName: "تاريخ الميلاد", field: "birth_date",      width: 120, minWidth: 80 },
    { headerName: "ملاحظات", field: "notes",       width: 150, minWidth: 150 },
    {
      headerName: "الخيارات", // عنوان عمود الخيارات (تعديل وحذف)
      cellRenderer: (params: any) => {
        const id = params.data.id; // الحصول على معرف المعلم من بيانات الصف
        return (
                 <div className="flex gap-1 items-center h-full">
            {/* زر التعديل */}
            <Button size="xs" onClick={() => router.visit(`/teachers/${id}/edit`)}>
              تعديل
            </Button>

            {/* مربع حوار تأكيد الحذف */}
            <Dialog open={openDialogId === id} onOpenChange={(open) => setOpenDialogId(open ? id : null)}>
              <DialogTrigger asChild>
                {/* زر الحذف */}
                <Button size="xs" variant="destructive">
                  حذف
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تأكيد الحذف</DialogTitle>
                  <DialogDescription>
                    هل أنت متأكد من حذف هذا المعلم؟ لا يمكن التراجع بعد الحذف.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter> {/* تم استخدام DialogFooter لتخطيط أفضل لأزرار الإجراءات */}
                  <Button variant="outline" onClick={() => setOpenDialogId(null)}>
                    إلغاء
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(id)}>
                    حذف
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      },
      width: 150, // عرض العمود
      minWidth: 150, // تم إضافة minWidth لتحسين الاستجابة
      sortable: false, // عمود الإجراءات عادة لا يكون قابلًا للترتيب
      filter: false, // عمود الإجراءات عادة لا يكون قابلًا للفلترة
      resizable: false, // منع تغيير حجم عمود الإجراءات
    },
  ];

  
  return (
    <AppLayout breadcrumbs={[{ title: " المدرسين", href: "/teachers" }]}>
      <Head title=" المدرسين " />
      {/* قسم الرأس مع العنوان وزر إضافة معلم جديد */}
      <div className="flex justify-between items-center mb-4 p-2">
        <h1 className="text-2xl font-bold">قائمة المدرسين</h1>
        <Button onClick={() => router.visit("/teachers/create")}>
          + إضافة مدرس جديد
        </Button>
      </div>

      {/* حاوية AG-Grid */}

        <ThemedAgGrid
          rowData={teachers}
          columnDefs={columnDefs}
        />
      
      <div className="flex justify-between items-center mb-4 p-2">
<Button variant="secondary" onClick={() => setRateDialogOpen(true)}>
  تعديل أجر الساعة الافتراضي
</Button>

      </div>
<Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>تعديل أجر الساعة الافتراضي</DialogTitle>
      <DialogDescription>سيتم تطبيق هذه القيمة على المعلمين الذين لم يُحدد لهم أجر خاص.</DialogDescription>
    </DialogHeader>

    <div className="my-4 space-y-2">
      <label className="block text-sm">أجر الساعة (ريال)</label>
      <input
        type="number"
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="border rounded px-3 py-2 w-full"
        min={0}
      />
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setRateDialogOpen(false)}>
        إلغاء
      </Button>
      <Button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          router.put(
            "/salary-settings/update",
            { default_hourly_rate: rate },
            {
              onSuccess: () => {
                toast.success("تم تحديث أجر الساعة بنجاح");
                setRateDialogOpen(false);
              },
              onError: () => toast.error("حدث خطأ أثناء التحديث"),
              onFinish: () => setLoading(false),
            }
          );
        }}
      >
        حفظ
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </AppLayout>
  );
}


import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StudentActions({ studentId }: { studentId: number }) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    router.delete(`/students/${studentId}`, {
onSuccess: () => {
  setOpen(false);

  toast.success("تم حذف الطالب بنجاح", {
    action: {
      label: "تراجع",
      onClick: () => {
        router.post(`/students/${studentId}/restore`);
      },
    },
  });
},
      onError: () => {
        toast.error("حدث خطأ أثناء الحذف، يرجى المحاولة لاحقاً");
      },
    });
  };

  return (
    <div className="flex gap-2">
      <Link
        href={`/students/${studentId}/edit`}
        className="text-yellow-600 hover:underline text-sm"
      >
        تعديل
      </Link>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="text-red-600 hover:underline text-sm">حذف</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد حذف هذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              حذف
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
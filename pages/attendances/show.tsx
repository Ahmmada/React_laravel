import { usePage, router } from "@inertiajs/react";
import { useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Student = {
  id: number;
  name: string;
  pivot: {
    status: "present" | "excused" | "absent";
  };
};

type Attendance = {
  id: number;
  attendance_date: string;
  center: { name: string };
  level: { name: string };
  students: Student[];
};

export default function ShowAttendance() {
  const { attendance, flash } = usePage().props as {
    attendance: Attendance;
    flash?: { success?: string; errors?: any };
  };

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.errors?.msg) toast.error(flash.errors.msg);
  }, [flash]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "text-green-600 font-semibold";
      case "excused":
        return "text-yellow-500 font-semibold";
      case "absent":
      default:
        return "text-red-600 font-semibold";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "present":
        return "️️ حاضر   ✔";
      case "excused":
        return "مستأذن  ⏳ ";
      case "absent":
      default:
        return " غائب  ❌ ";
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تفاصيل الحضور", href: `/attendances/${attendance.id}` }]}>
      <div className=" p-2 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">تفاصيل وثيقة الحضور</h1>
        <Button variant="secondary" onClick={() => router.visit("/attendances")}>
          رجوع
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <strong>📅 التاريخ:</strong> {attendance.attendance_date}
          </div>
          <div>
            <strong>🏢 المركز:</strong> {attendance.center.name}
          </div>
          <div>
            <strong>📘 المستوى:</strong> {attendance.level.name}
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="table-auto w-full border">
            <thead className="bg-gray-100 dark:bg-gray-600 dark:text-white">
              <tr>
                <th className="p-2 border text-right">اسم الطالب</th>
                <th className="p-2 border text-center">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {attendance.students.map((student) => (
                <tr key={student.id}>
                  <td className="p-2 border">{student.name}</td>
                  <td className={`p-2 border text-center ${getStatusColor(student.pivot.status)}`}>
                    {getStatusLabel(student.pivot.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}
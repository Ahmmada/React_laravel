import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Teacher = {
  id: number;
  name: string;
  pivot: {
    arrival_time: string | null;
    departure_time: string | null;
  };
};

type TeacherAttendance = {
  id: number;
  attendance_date: string;
  group: {
    id: number;
    name: string;
  };
  teachers: Teacher[];
};

export default function TeacherAttendanceEdit() {
  const { teacherAttendance, flash, errors: pageErrors } = usePage().props as {
    teacherAttendance: TeacherAttendance;
    flash?: { success?: string };
    errors?: Record<string, string>;
  };

  const { data, setData, put, processing, errors } = useForm({
    attendance_date: teacherAttendance.attendance_date,
    teachers: Object.fromEntries(
      teacherAttendance.teachers.map((t) => [
        t.id,
        {
          arrival_time: t.pivot.arrival_time || "",
          departure_time: t.pivot.departure_time || "",
        },
      ])
    ),
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
  }, [flash]);

  const handleTimeChange = (teacherId: number, field: "arrival_time" | "departure_time", value: string) => {
    const teacher = data.teachers[teacherId] || { arrival_time: "", departure_time: "" };

    if (field === "departure_time" && teacher.arrival_time && value <= teacher.arrival_time) {
      toast.error("وقت الانصراف يجب أن يكون بعد وقت الحضور");
      return;
    }

    setData("teachers", {
      ...data.teachers,
      [teacherId]: {
        ...teacher,
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("teacher_attendance.update", teacherAttendance.id));
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تعديل وثيقة تحضير المدرسين", href: `/teacher-attendance/${teacherAttendance.id}/edit` }]}>
      <Head title="تعديل وثيقة تحضير المدرسين" />

      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">تعديل وثيقة تحضير المدرسين</h2>
          <Button variant="outline" onClick={() => router.get("/teacher_attendance")}>
            رجوع
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>تاريخ التحضير</Label>
              <Input
                type="date"
                value={data.attendance_date}
                readOnly
              />
            </div>

            <div>
              <Label>المجموعة</Label>
              <Input
                type="text"
                value={teacherAttendance.group.name}
                readOnly
              />
            </div>
          </div>

          <Card className="p-4">
            <h4 className="text-lg font-semibold mb-4">قائمة المدرسين</h4>

            <div className="overflow-x-auto">
              <table className="table-auto w-full border">
                <thead className="bg-gray-100 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th className="p-2 border">اسم المدرس</th>
                    <th className="p-2 border">وقت الحضور</th>
                    <th className="p-2 border">وقت الانصراف</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherAttendance.teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="p-2 border">{teacher.name}</td>
                      <td className="p-2 border">
                        <Input
                          type="time"
                          value={data.teachers[teacher.id]?.arrival_time || ""}
                          onChange={(e) => handleTimeChange(teacher.id, "arrival_time", e.target.value)}
                        />
                      </td>
                      <td className="p-2 border">
                        <Input
                          type="time"
                          value={data.teachers[teacher.id]?.departure_time || ""}
                          onChange={(e) => handleTimeChange(teacher.id, "departure_time", e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="text-right space-x-2">
            <Button type="submit" disabled={processing}>
              حفظ التعديلات
            </Button>
            <Button variant="outline" onClick={() => router.get("/teacher_attendance")}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
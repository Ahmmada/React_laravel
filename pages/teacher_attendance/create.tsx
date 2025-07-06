// resources/js/pages/teacher_attendance/create.tsx
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { toast } from "sonner";

type Group = { id: number; name: string };
type Teacher = { id: number; name: string };

export default function TeacherAttendanceCreate() {
  const { groups, flash, errors: pageErrors } = usePage().props as {
    groups: Group[];
    flash?: { success?: string };
    errors?: Record<string, string>;
  };

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teacherTimes, setTeacherTimes] = useState<Record<number, { arrival_time?: string; departure_time?: string }>>({});
  const [loading, setLoading] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    attendance_date: "",
    group_id: "",
    teachers: {} as Record<number, { arrival_time?: string; departure_time?: string }>
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
  }, [flash]);

  useEffect(() => {
    if (data.group_id) {
      setLoading(true);
      axios.post(route("teacher_attendance.getTeachers"), { group_id: data.group_id })
        .then((res) => {
          setTeachers(res.data.data);
          setTeacherTimes({});
          setData("teachers", {});
        })
        .catch(() => {
          toast.error("فشل في تحميل المدرسين");
          setTeachers([]);
        })
        .finally(() => setLoading(false));
    } else {
      setTeachers([]);
      setTeacherTimes({});
      setData("teachers", {});
    }
  }, [data.group_id]);

  const handleTimeChange = (teacherId: number, field: "arrival_time" | "departure_time", value: string) => {
    const currentTimes = teacherTimes[teacherId] || {};
    const newTimes = { ...currentTimes, [field]: value };

    // التحقق من أن وقت الانصراف بعد الحضور
    if (field === "departure_time" && newTimes.arrival_time && value <= newTimes.arrival_time) {
      toast.error("وقت الانصراف يجب أن يكون بعد وقت الحضور");
      return;
    }

    setTeacherTimes((prev) => ({ ...prev, [teacherId]: newTimes }));
    setData("teachers", {
      ...data.teachers,
      [teacherId]: newTimes,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("teacher_attendance.store"));
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تسجيل حضور المدرسين", href: "/teacher-attendance/create" }]}>
      <Head title="تسجيل حضور المدرسين" />

      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">تسجيل حضور المدرسين</h2>
          <Button variant="outline" onClick={() => router.get("/teacher_attendance")}>
            رجوع
          </Button>
                  </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>التاريخ</Label>
              <Input
                type="date"
                value={data.attendance_date}
                onChange={(e) => setData("attendance_date", e.target.value)}
                required
              />
              {errors.attendance_date && <p className="text-red-600 text-sm">{errors.attendance_date}</p>}
            </div>

            <div>
              <Label>المجموعة</Label>
              <select
                value={data.group_id}
                onChange={(e) => setData("group_id", e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                <option value="">-- اختر المجموعة --</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.group_id && <p className="text-red-600 text-sm">{errors.group_id}</p>}
            </div>
          </div>

          <Card className="p-4">
            <h4 className="text-lg font-semibold mb-4">قائمة المدرسين</h4>

            {loading ? (
              <div className="text-gray-500">جاري تحميل المدرسين...</div>
            ) : teachers.length > 0 ? (
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
                    {teachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td className="p-2 border">{teacher.name}</td>
                        <td className="p-2 border">
                          <Input
                            type="time"
                            value={teacherTimes[teacher.id]?.arrival_time || ""}
                            onChange={(e) =>
                              handleTimeChange(teacher.id, "arrival_time", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-2 border">
                          <Input
                            type="time"
                            value={teacherTimes[teacher.id]?.departure_time || ""}
                            onChange={(e) =>
                              handleTimeChange(teacher.id, "departure_time", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-600">يرجى اختيار المجموعة أولاً لعرض المدرسين</div>
            )}
          </Card>

          <div className="text-right">
            <Button type="submit" disabled={processing}>
              حفظ الحضور
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
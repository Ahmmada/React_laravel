import React, { useEffect } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Student = {
  id: number;
  name: string;
  pivot: {
    status: "present" | "excused" | "absent";
  };
};

type AttendanceData = {
  id: number;
  attendance_date: string;
  center: { name: string };
  level: { name: string };
  students: Student[];
};

export default function EditAttendance() {
  const { attendance, flash } = usePage().props as {
    attendance: AttendanceData;
    flash?: { success?: string; errors?: any };
  };

  const { data, setData, processing } = useForm({
    present: attendance.students
      .filter((s) => s.pivot.status === "present")
      .map((s) => s.id),
    excused: attendance.students
      .filter((s) => s.pivot.status === "excused")
      .map((s) => s.id),
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.errors?.msg) toast.error(flash.errors.msg);
  }, [flash]);

  const handleCheckboxChange = (
    studentId: number,
    type: "present" | "excused"
  ) => {
    const otherType = type === "present" ? "excused" : "present";

    const isAlreadyChecked = data[type].includes(studentId);

    if (isAlreadyChecked) {
      // إذا تم الضغط مرة ثانية → أزل التحديد
      setData(type, data[type].filter((id) => id !== studentId));
    } else {
      // أضف لهذا النوع، وأزل من النوع الآخر
      setData(type, [...data[type], studentId]);
      setData(otherType, data[otherType].filter((id) => id !== studentId));
    }
  };

  const isChecked = (studentId: number, type: "present" | "excused") =>
    data[type].includes(studentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(route("attendances.update", attendance.id), data);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: "تعديل الحضور", href: `/attendances/${attendance.id}/edit` },
      ]}
    >
      <div className=" p-2 flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">تعديل الحضور</h1>
        <Button variant="secondary" onClick={() => router.visit("/attendances")}>
          رجوع
        </Button>
      </div>

      <Card className="p-4">
        <p>
          <strong>📅 التاريخ:</strong> {attendance.attendance_date}
        </p>
        <p>
          <strong>🏢 المركز:</strong> {attendance.center.name}
        </p>
        <p>
          <strong>📘 المستوى:</strong> {attendance.level.name}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto mt-4">
            <table className="table-auto w-full border">
              <thead className="bg-gray-100 dark:bg-gray-600 dark:text-white">
                <tr>
                  <th className="border p-2 text-right">اسم الطالب</th>
                  <th className="border p-2 text-center">حاضر</th>
                  <th className="border p-2 text-center">مستأذن</th>
                </tr>
              </thead>
              <tbody>
                {attendance.students.map((student) => (
                  <tr key={student.id}>
                    <td className="border p-2">{student.name}</td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked(student.id, "present")}
                        onChange={() =>
                          handleCheckboxChange(student.id, "present")
                        }
                      />
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked(student.id, "excused")}
                        onChange={() =>
                          handleCheckboxChange(student.id, "excused")
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-right mt-4">
            <Button type="submit" disabled={processing}>
              تحديث الحضور
            </Button>
          </div>
        </form>
      </Card>
    </AppLayout>
  );
}
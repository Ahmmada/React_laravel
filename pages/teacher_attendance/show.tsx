// resources/js/pages/teacher_attendance/show.tsx
import { Head, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  attendance_date: string; // expected in format YYYY-MM-DD
  group: { id: number; name: string };
  teachers: Teacher[];
};

export default function TeacherAttendanceShow() {
  const { teacherAttendance } = usePage().props as {
    teacherAttendance: TeacherAttendance;
  };

  const formatTime = (time: string | null) =>
    time ? time : "-";

  const calculateDuration = (arrival: string | null, departure: string | null) => {
    if (!arrival || !departure) return "-";

    const [aH, aM] = arrival.split(":").map(Number);
    const [dH, dM] = departure.split(":").map(Number);

    let totalMinutes = (dH * 60 + dM) - (aH * 60 + aM);
    if (totalMinutes <= 0) return "-";

    const hours = Math.floor(totalMinutes / 60).toString().padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // اسم اليوم يدويًا (اختياري)
  const getArabicDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    return days[date.getDay()];
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تقرير حضور المدرسين", href: `/teacher-attendance/${teacherAttendance.id}` }]}>
      <Head title="تقرير حضور المدرسين" />

      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">تقرير حضور المدرسين</h2>
          <Button variant="outline" onClick={() => router.get("/teacher_attendance")}>
            العودة للقائمة
          </Button>
        </div>

        <Card className="p-4 space-y-2">
          <p><strong>اليوم:</strong> {getArabicDay(teacherAttendance.attendance_date)}</p>
          <p><strong>التاريخ:</strong> {teacherAttendance.attendance_date}</p>
          <p><strong>المجموعة:</strong> {teacherAttendance.group?.name || "غير محدد"}</p>
        </Card>

        <Card className="p-4">
          {teacherAttendance.teachers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border">
                <thead className="bg-gray-100 dark:bg-gray-700 dark:text-white">
                  <tr>
                    <th className="p-2 border">المدرس</th>
                    <th className="p-2 border">وقت الحضور</th>
                    <th className="p-2 border">وقت الانصراف</th>
                    <th className="p-2 border">عدد الساعات</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherAttendance.teachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td className="p-2 border">{teacher.name}</td>
                      <td className="p-2 border">{teacher.arrival_time_ar}</td>
                      <td className="p-2 border">{teacher.departure_time_ar}</td>
                      <td className="p-2 border">
                        {teacher.hours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-warning text-yellow-700 font-medium">
              لا توجد بيانات حضور للمدرسين في هذه الوثيقة.
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
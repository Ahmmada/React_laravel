import { usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AttendanceReportTable() {
  const { attendanceData, dates, center, level, request } = usePage().props as {
    attendanceData: Record<
      string,
      {
        records: Record<string, string>;
        present: number;
        absent: number;
        excused: number;
      }
    >;
    dates: string[];
    center: { name: string };
    level: { name: string };
    request: {
      from_date: string;
      to_date: string;
    };
  };

  return (
    <AppLayout breadcrumbs={[{ title: "جدول التقرير", href: "/attendance-report" }]}>
      <div className="flex justify-between mb-4 p-2">
        <h1 className="text-2xl font-bold">تقرير حضور الطلاب</h1>
        <Button variant="secondary" onClick={() => router.visit("/attendance-report")}>
          رجوع
        </Button>
      </div>

      <Card className="p-4">
        <div className="mb-4 space-y-1 text-sm text-gray-700">
          <p><strong>📍 المركز:</strong> {center.name}</p>
          <p><strong>📘 المستوى:</strong> {level.name}</p>
          <p>
            <strong>📅 الفترة:</strong> من (
            {new Date(request.from_date).toLocaleDateString()}) إلى (
            {new Date(request.to_date).toLocaleDateString()})
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-right overflow-x-auto">الاسم</th>
                {dates.map((date) => (
                  <th key={date} className="p-2 border text-center">
                    {new Date(date).toLocaleDateString("ar-EG", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                  </th>
                ))}
                <th className="p-2 border text-center">✔️</th>
                <th className="p-2 border text-center">❌</th>
                <th className="p-2 border text-center">⏳</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(attendanceData).map(([studentName, data]) => (
                <tr key={studentName}>
                  <td className="p-2 border text-right">{studentName}</td>
                  {dates.map((date) => (
                    <td key={date} className="p-2 border text-center">
                      {data.records[date] || "-"}
                    </td>
                  ))}
                  <td className="p-2 border text-center">{data.present}</td>
                  <td className="p-2 border text-center">{data.absent}</td>
                  <td className="p-2 border text-center">{data.excused}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppLayout>
  );
}
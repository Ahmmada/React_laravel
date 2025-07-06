import { Head, useForm, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TeacherAttendanceTable from "./partials/TeacherAttendanceTable";
import { toast } from "sonner";

interface Group {
  id: number;
  name: string;
}

interface TeacherAttendancePageProps {
  groups: Group[];
  attendanceData: any[];
  dates: string[];
  from_date: string | null;
  to_date: string | null;
  group: Group | null;
}

export default function TeacherReportPage() {
  const { groups, attendanceData, dates, from_date, to_date, group } =
    usePage<TeacherAttendancePageProps>().props;

  const { data, setData, get, processing, errors, reset } = useForm({
    from_date: from_date || "",
    to_date: to_date || "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    get(route("teacher_attendance.generateReport"), {
      preserveState: true,
      onError: () => toast.error("حدث خطأ. تأكد من صحة البيانات"),
    });
  };

  const handleReset = () => {
    reset();
    router.get(route("teacher_attendance.report.form"));
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تقرير حضور المدرسين", href: "/teacher_attendance/report/form" }]}>
      <Head title="تقرير حضور المدرسين" />

      <div className="p-4 space-y-6">
        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => router.get("/teacher_attendance")}>
            رجوع
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            إعادة تعيين
          </Button>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 border rounded">


          <div>
            <label>من تاريخ:</label>
            <Input
              type="date"
              value={data.from_date}
              onChange={(e) => setData("from_date", e.target.value)}
              required
            />
          </div>

          <div>
            <label>إلى تاريخ:</label>
            <Input
              type="date"
              value={data.to_date}
              onChange={(e) => setData("to_date", e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-3 text-right">
            <Button type="submit" disabled={processing}>
              عرض التقرير
            </Button>
          </div>
        </form>

        {attendanceData.length > 0 ? (
          <TeacherAttendanceTable
            attendanceData={attendanceData}
            dates={dates}
            from_date={from_date!}
            to_date={to_date!}
            group_name={group?.name || ""}
          />
        ) : (
          <div className="text-gray-500 text-center p-10">يرجى اختيار مجموعة وتحديد فترة لعرض التقرير.</div>
        )}
      </div>
    </AppLayout>
  );
}
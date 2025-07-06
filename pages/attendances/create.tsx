import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

type Center = { id: number; name: string };
type Level = { id: number; name: string };
type Student = { id: number; name: string };

export default function AttendanceCreate() {
  const { centers, levels, flash } = usePage().props as {
    centers: Center[];
    levels: Level[];
    flash?: { success?: string; errors?: any };
  };

  const [students, setStudents] = useState<Student[]>([]);

  const { data, setData, post, processing, errors } = useForm({
    attendance_date: "",
    center_id: "",
    level_id: "",
    present: [] as number[],
    excused: [] as number[],
  });

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.errors?.msg) toast.error(flash.errors.msg);
  }, [flash]);

  useEffect(() => {
    if (data.center_id && data.level_id) {
      axios
        .post(route("attendances.getStudents"), {
          center_id: data.center_id,
          level_id: data.level_id,
        })
        .then((res) => {
          setStudents(res.data);
        })
        .catch(() => {
          toast.error("فشل في تحميل الطلاب");
          setStudents([]);
        });
    } else {
      setStudents([]);
    }
  }, [data.center_id, data.level_id]);

  const handleCheckbox = (studentId: number, type: "present" | "excused") => {
    const otherType = type === "present" ? "excused" : "present";
    const isAlreadyChecked = data[type].includes(studentId);

    if (isAlreadyChecked) {
      setData(type, data[type].filter((id) => id !== studentId));
    } else {
      setData(type, [...data[type], studentId]);
      setData(otherType, data[otherType].filter((id) => id !== studentId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(route("attendances.checkDuplicate"), {
        attendance_date: data.attendance_date,
        center_id: data.center_id,
        level_id: data.level_id,
      });

      if (res.data.exists) {
        toast.error("تم تسجيل الحضور مسبقاً لهذا المستوى والمركز في نفس التاريخ.");
        return;
      }

      post(route("attendances.store"));
    } catch {
      toast.error("حدث خطأ أثناء التحقق من التكرار");
    }
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تحضير الطلاب", href: "/attendances/create" }]}>
      <Head title="تحضير الطلاب" />

      <div className=" p-2 mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-2">تحضير الطلاب</h2>
        <Button variant="outline" onClick={() => router.get("/attendances")}>
          رجوع
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4  p-2">
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
            <Label>المركز</Label>
            <select
              value={data.center_id}
              onChange={(e) => setData("center_id", e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">اختر المركز</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            {errors.center_id && <p className="text-red-600 text-sm">{errors.center_id}</p>}
          </div>

          <div>
            <Label>المستوى</Label>
            <select
              value={data.level_id}
              onChange={(e) => setData("level_id", e.target.value)}
              className="w-full border rounded p-2"
              required
            >
              <option value="">اختر المستوى</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
            {errors.level_id && <p className="text-red-600 text-sm">{errors.level_id}</p>}
          </div>
        </div>

        <div className="overflow-x-auto p-2">
          <table className="table-auto w-full border mt-4">
            <thead className="bg-gray-100 dark:bg-gray-600 dark:text-white" >
              <tr>
                <th className="p-2 border">الطالب</th>
                <th className="p-2 border">حاضر</th>
                <th className="p-2 border">مستأذن</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="p-2 border">{student.name}</td>
                    <td className="p-2 border text-center">
                      <input
                        type="checkbox"
                        checked={data.present.includes(student.id)}
                        onChange={() => handleCheckbox(student.id, "present")}
                      />
                    </td>
                    <td className="p-2 border text-center">
                      <input
                        type="checkbox"
                        checked={data.excused.includes(student.id)}
                        onChange={() => handleCheckbox(student.id, "excused")}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center p-4">
                    {data.center_id && data.level_id
                      ? "لا يوجد طلاب في هذا المركز والمستوى"
                      : "يرجى اختيار المركز والمستوى لعرض الطلاب"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className=" text-right p-2 ">
          <Button type="submit" disabled={processing}>
            حفظ الحضور
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
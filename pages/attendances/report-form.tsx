import { Head, useForm, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Center = { id: number; name: string };
type Level = { id: number; name: string };

export default function ReportForm() {
  const { centers, levels, flash } = usePage().props as {
    centers: Center[];
    levels: Level[];
    flash?: { success?: string; errors?: any };
  };

  const { data, setData, post, processing, errors } = useForm({
    center_id: "",
    level_id: "",
    from_date: "",
    to_date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("attendances.generateReport"));
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تقرير الحضور", href: "/attendance-report" }]}>
      <Head title="تقرير حضور الطلاب" />
      <div className="flex justify-between mb-4 p-2">
        <h1 className="text-2xl font-bold">تقرير حضور الطلاب</h1>
        <Button variant="secondary" onClick={() => router.get("/attendances")}>
          رجوع
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>المركز</Label>
            <select
              value={data.center_id}
              onChange={(e) => setData("center_id", e.target.value)}
              className="w-full border p-2 rounded"
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
              className="w-full border p-2 rounded"
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

          <div>
            <Label>من تاريخ</Label>
            <Input
              type="date"
              value={data.from_date}
              onChange={(e) => setData("from_date", e.target.value)}
              required
            />
            {errors.from_date && <p className="text-red-600 text-sm">{errors.from_date}</p>}
          </div>

          <div>
            <Label>إلى تاريخ</Label>
            <Input
              type="date"
              value={data.to_date}
              onChange={(e) => setData("to_date", e.target.value)}
              required
            />
            {errors.to_date && <p className="text-red-600 text-sm">{errors.to_date}</p>}
          </div>
        </div>

        {flash?.errors?.msg && (
          <p className="text-red-600 text-sm">{flash.errors.msg}</p>
        )}

        <div className="text-right">
          <Button type="submit" disabled={processing}>
            عرض التقرير
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
import { Head, useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import StudentForm from "./partials/StudentForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";


export default function Create({ centers, levels }: any) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    birth_date: "",
    address: "",
    phone: "",
    notes: "",
    center_id: "",
    level_id: "",
  });

  return (
    <AppLayout breadcrumbs={[{ title: "إضافة طالب", href: "/students/create" }]}>
      <Head title="إضافة طالب جديد" />

      <div className="p-2 flex justify-between items-center mb-4">
        <Link href="/students">
          <Button variant="default" className="bg-gray-700 text-white" >رجوع</Button>
        </Link>
      </div>

      <Card className="p-2 space-y-4">
        <h2 className="text-xl font-semibold">إضافة طالب جديد</h2>

        {Object.keys(errors).length > 0 && (
          <div className="text-red-500 text-sm">
            <ul>{Object.values(errors).map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}

<form
  onSubmit={(e) => {
    e.preventDefault();
    post("/students");
  }}
  className="space-y-4"
>
  <StudentForm data={data} onChange={setData} centers={centers} levels={levels} />
  <Button type="submit" disabled={processing}>حفظ</Button>
</form>
      </Card>
    </AppLayout>
  );
}
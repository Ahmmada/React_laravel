import { useForm, router, Head, usePage, Link } from "@inertiajs/react";
import TeacherForm from "./partials/TeacherForm";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";

export default function TeacherCreate() {
  const { groups, flash, errors } = usePage().props as {
    groups: Group[];
    flash?: { success?: string };
    errors?: Record<string, string>;
  };

  const { data, setData, post, processing } = useForm<TeacherFormData>({
    name: "",
    group_id: undefined,
    position: "",
    phone: "",
    address: "",
    birth_date: "",
    notes: "",
    hourly_rate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("teachers.store"));
  };

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
  }, [flash]);

  return (
    <AppLayout breadcrumbs={[{ title: "إضافة مدرس", href: "/teachers/create" }]}>
      <Head title="إضافة مدرس" />
            <div className="p-2 flex justify-between items-center mb-4">
        <Link href="/teachers">
          <Button variant="default" className="bg-gray-700 text-white" >رجوع</Button>
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 p-2">
        <TeacherForm data={data} setData={setData} groups={groups} errors={errors} />
        <Button type="submit" disabled={processing}>حفظ</Button>
      </form>
    </AppLayout>
  );
}
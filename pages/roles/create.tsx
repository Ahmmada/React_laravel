import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import RoleForm from "./partials/RoleForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Create() {
  const { permissions } = usePage().props as {
    permissions: { id: number; name: string }[];
  };

  const handleSubmit = (form: any) => {
    router.post("/roles", form);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "إضافة دور", href: "/roles/create" }]}>
      <Head title="إضافة دور جديد" />
      <div className="mb-4 p-2">
        <Button variant="secondary"                 size="sm" onClick={() => router.get("/roles")}>رجوع</Button>
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">إضافة دور جديد</h2>
        <RoleForm permissions={permissions} onSubmit={handleSubmit} />
      </Card>
    </AppLayout>
  );
}
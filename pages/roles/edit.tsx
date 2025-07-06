import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import RoleForm from "./partials/RoleForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Edit() {
  const { role, permissions, rolePermissions } = usePage().props as {
    role: { id: number; name: string };
    permissions: { id: number; name: string }[];
    rolePermissions: number[];
  };

  const handleSubmit = (form: any) => {
    router.put(`/roles/${role.id}`, form);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تعديل الدور", href: `/roles/${role.id}/edit` }]}>
      <Head title={`تعديل الدور ${role.name}`} />
      <div className="mb-4 p-2">
        <Button variant="secondary"                 size="sm" onClick={() => router.get("/roles")}>رجوع</Button>
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">تعديل الدور</h2>
        <RoleForm
          isEdit
          role={role}
          permissions={permissions}
          selected={rolePermissions}
          onSubmit={handleSubmit}
        />
      </Card>
    </AppLayout>
  );
}
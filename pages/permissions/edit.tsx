import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PermissionForm from "./partials/PermissionForm";

export default function EditPermission() {
  const { permission } = usePage().props as {
    permission: { id: number; name: string };
  };

  const handleSubmit = (data: any) => {
    router.put(`/permissions/${permission.id}`, data);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تعديل الإذن", href: `/permissions/${permission.id}/edit` }]}>
      <Head title={`تعديل الإذن: ${permission.name}`} />
      <div className="p-4 space-y-6">
      <div className="mb-4">
        <Button variant="secondary"                 size="sm" onClick={() => router.get("/permissions")}>رجوع</Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">تعديل الإذن</h2>
        <PermissionForm
          permission={permission}
          isEdit
          onSubmit={handleSubmit}
        />
      </Card>
      </div>
    </AppLayout>
  );
}
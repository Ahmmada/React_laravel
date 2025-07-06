import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PermissionForm from "./partials/PermissionForm";

export default function CreatePermission() {
  const handleSubmit = (data: any) => {
    router.post("/permissions", data);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "إضافة إذن", href: "/permissions/create" }]}>
      <Head title="إنشاء إذن جديد" />
      <div className="p-4 space-y-6">
      <div className="mb-4">
        <Button variant="secondary"                 size="sm" onClick={() => router.get("/permissions")}>رجوع</Button>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">إضافة إذن جديد</h2>
        <PermissionForm onSubmit={handleSubmit} />
      </Card>
            </div>
    </AppLayout>
  );
}
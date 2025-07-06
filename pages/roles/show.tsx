import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Role = {
  id: number;
  name: string;
};

type Permission = {
  id: number;
  name: string;
};

export default function RoleShow() {
  const { role, rolePermissions } = usePage().props as {
    role: Role;
    rolePermissions: Permission[];
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تفاصيل الدور", href: `/roles/${role.id}` }]}>
      <Head title={`تفاصيل الدور: ${role.name}`} />
      
      <div className="mb-4 p-2">
        <Button variant="secondary"                 size="sm" onClick={() => router.get("/roles")}>
          رجوع
        </Button>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">عرض معلومات الدور</h2>

        <div>
          <p className="font-semibold">اسم الدور:</p>
          <p className="text-gray-700">{role.name}</p>
        </div>

        <div>
          <p className="font-semibold">الصلاحيات:</p>
          {rolePermissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {rolePermissions.map((perm) => (
                <span key={perm.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {perm.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">لا توجد صلاحيات مرتبطة بهذا الدور.</p>
          )}
        </div>
      </Card>
    </AppLayout>
  );
}
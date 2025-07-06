import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import UserForm from "./partials/UserForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Create() {
  const { roles, centers, groups, locations } = usePage().props as {
    roles: Record<string, string>;
    centers: { id: number; name: string }[];
    groups: { id: number; name: string }[];
    locations: { id: number; name: string }[];
    
  };

  const handleSubmit = (form: any) => {
    router.post("/users", form);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "إنشاء مستخدم", href: "/users/create" }]}>
      <Head title="إضافة مستخدم جديد" />
      <div className="mb-4  p-2">
        <Button variant="secondary"                size="sm" onClick={() => router.get("/users")}>رجوع</Button>
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">إضافة مستخدم جديد</h2>
        <UserForm roles={roles} centers={centers} groups={groups} locations={locations}  onSubmit={handleSubmit} />
      </Card>
    </AppLayout>
  );
}
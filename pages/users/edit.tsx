import { Head, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import UserForm from "./partials/UserForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Edit() {
  const { user, roles, centers, groups, locations } = usePage().props as {
    user: any;
    roles: Record<string, string>;
    centers: { id: number; name: string }[];
    groups: { id: number; name: string }[];
    locations: { id: number; name: string }[];
    
  };

  const handleSubmit = (form: any) => {
    router.put(`/users/${user.id}`, form);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تعديل مستخدم", href: `/users/${user.id}/edit` }]}>
      <Head title={`تعديل المستخدم ${user.name}`} />
      <div className="mb-4 p-2">
        <Button variant="secondary"                 size="sm" onClick={() => router.get("/users")}>رجوع</Button>
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">تعديل بيانات المستخدم</h2>
        <UserForm roles={roles} centers={centers} groups={groups} locations={locations}  user={user} onSubmit={handleSubmit} isEdit />
      </Card>
    </AppLayout>
  );
}
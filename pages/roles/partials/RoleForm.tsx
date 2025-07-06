import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  role?: { name: string };
  permissions: { id: number; name: string }[];
  selected?: number[];
  onSubmit: (form: any) => void;
  isEdit?: boolean;
};

export default function RoleForm({ role, permissions, selected = [], onSubmit, isEdit = false }: Props) {
  const { data, setData, processing, errors } = useForm({
    name: role?.name ?? "",
    permission: selected,
  });

  const handleCheckboxChange = (id: number) => {
    const updated = data.permission.includes(id)
      ? data.permission.filter((p) => p !== id)
      : [...data.permission, id];
    setData("permission", updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>اسم الدور</Label>
        <Input
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <Label>الصلاحيات</Label>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border p-3 rounded">
          {permissions.map((perm) => (
            <label key={perm.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.permission.includes(perm.id)}
                onChange={() => handleCheckboxChange(perm.id)}
              />
              <span>{perm.name}</span>
            </label>
          ))}
        </div>
        {errors.permission && <p className="text-sm text-red-600">{errors.permission}</p>}
      </div>

      <div className="text-right">
        <Button type="submit" disabled={processing}>
          {isEdit ? "تحديث" : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Props = {
  permission?: { id: number; name: string };
  onSubmit: (data: any) => void;
  isEdit?: boolean;
};

export default function PermissionForm({ permission, onSubmit, isEdit = false }: Props) {
  const { data, setData, processing, errors } = useForm({
    name: permission?.name ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>اسم الإذن</Label>
        <Input
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div className="text-right">
        <Button type="submit" disabled={processing}>
          {isEdit ? "حفظ التعديلات" : "حفظ"}
        </Button>
      </div>
    </form>
  );
}
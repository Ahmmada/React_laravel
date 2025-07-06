import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeacherFormData, Group } from "./Types";

type Props = {
  data: TeacherFormData;
  setData: (key: keyof TeacherFormData, value: any) => void;
  groups: Group[];
  errors?: Record<string, string>;
};

export default function TeacherForm({ data, setData, groups, errors }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>الاسم</Label>
        <Input value={data.name} onChange={(e) => setData("name", e.target.value)} required />
        {errors?.name && <p className="text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <Label>المجموعة</Label>
        <Select value={String(data.group_id || "")} onValueChange={(value) => setData("group_id", parseInt(value))}>
          <SelectTrigger>
            <SelectValue placeholder="اختر المجموعة" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={String(group.id)}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.group_id && <p className="text-sm text-red-600">{errors.group_id}</p>}
      </div>

      <div>
        <Label>الصفة</Label>
        <Input value={data.position || ""} onChange={(e) => setData("position", e.target.value)} />
      </div>

      <div>
        <Label>رقم الهاتف</Label>
        <Input type="tel" value={data.phone || ""} onChange={(e) => setData("phone", e.target.value)} />
      </div>

      <div>
        <Label>العنوان</Label>
        <Input value={data.address || ""} onChange={(e) => setData("address", e.target.value)} />
      </div>

      <div>
        <Label>تاريخ الميلاد</Label>
        <Input type="date" value={data.birth_date || ""} onChange={(e) => setData("birth_date", e.target.value)} />
      </div>

      <div className="md:col-span-2">
        <Label>ملاحظات</Label>
        <Textarea value={data.notes || ""} onChange={(e) => setData("notes", e.target.value)} />
      </div>
      <div>
        <Label>أجر الساعة</Label>
        <Input type="number" value={data.hourly_rate || ""} onChange={(e) => setData("hourly_rate", e.target.value)} />
      </div>
    </div>
  );
}
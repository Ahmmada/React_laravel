import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormEventHandler } from "react";

type Center = { id: number; name: string };
type Level = { id: number; name: string };
type Student = {
  name: string;
  birth_date: string;
  address: string;
  phone: string;
  notes: string;
  center_id: string;
  level_id: string;
};

type Props = {
  data: Student;
  onChange: (field: keyof Student, value: string) => void;
  centers: Center[];
  levels: Level[];
};

export default function StudentForm({ data, onChange, centers, levels }: Props) {
  return (
    <div className="space-y-4">
<div className="flex w-full max-w-sm items-center space-x-2">
      <div>
        <Label>الاسم</Label>
        <Input className="w-[260px] px-1 py-0" value={data.name} onChange={(e) => onChange("name", e.target.value)} required />
      </div>
      <div>
        <Label>تاريخ الميلاد</Label>
        <Input className="w-[130px]  px-0 py-0" type="date" value={data.birth_date} onChange={(e) => onChange("birth_date", e.target.value)} />
      </div>
  </div>
<div className="flex w-full max-w-sm items-center space-x-2">
      <div>
        <Label>المركز</Label>
        <Select value={data.center_id} onValueChange={(val) => onChange("center_id", val)}>
          <SelectTrigger className="w-[195px]">
            <SelectValue placeholder="اختر المركز" />
          </SelectTrigger>
          <SelectContent>
            {centers.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>المستوى</Label>
        <Select value={data.level_id} onValueChange={(val) => onChange("level_id", val)}>
          <SelectTrigger className="w-[195px]">
            <SelectValue placeholder="اختر المستوى" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
            </div>
<div className="flex w-full max-w-sm items-center space-x-2">

      <div>
        <Label>رقم الهاتف</Label>
        <Input className="w-[195px]" type="number" value={data.phone} onChange={(e) => onChange("phone", e.target.value)} />
      </div>
      <div>
        <Label>العنوان</Label>
        <Input className="w-[195px]"  value={data.address} onChange={(e) => onChange("address", e.target.value)} />
      </div>
      </div>

      <div>
        <Label>ملاحظات</Label>
        <Textarea  className="w-[400px]" value={data.notes} onChange={(e) => onChange("notes", e.target.value)} />
      </div>

    </div>
  );
}
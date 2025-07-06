import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import usePermission from "@/hooks/usePermission";
import { useState } from "react";

// ...

type Props = {
  roles: Record<string, string>;
  centers: { id: number; name: string }[];
  groups: { id: number; name: string }[];
  locations: { id: number; name: string }[];
  user?: any;
  onSubmit: (form: any) => void;
  isEdit?: boolean;
};

export default function UserForm({ roles, centers, groups, locations, user, onSubmit, isEdit = false }: Props) {
    // تأكد أن usePermission تُرجع true أو false
    const canAssign = usePermission("ادوار المستخدمين") ?? false;
    
    const { data, setData, errors, processing } = useForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "",
        confirmPassword: "",
        roles: user?.roles?.map((r: any) => r.name) ?? [],
        centers: user?.centers?.map((c: any) => c.id) ?? [],
        groups: user?.groups?.map((c: any) => c.id) ?? [],
        locations: user?.locations?.map((c: any) => c.id) ?? [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.password !== data.confirmPassword) {
            setPasswordMismatch(true);
            return;
        }

        setPasswordMismatch(false);

        onSubmit({
            ...data,
            "confirm-password": data.confirmPassword,
        });
    };
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label>اسم المستخدم</Label>
                <Input value={data.name} onChange={(e) => setData("name", e.target.value)} />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
            </div>

            <div>
                <Label>{isEdit ? "كلمة المرور الجديدة" : "كلمة المرور"}</Label>
                <Input type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} />
            </div>

            <div>
                <Label>تأكيد كلمة المرور</Label>
                <Input
                    type="password"
                    value={data.confirmPassword}
                    onChange={(e) => setData("confirmPassword", e.target.value)}
                />
                {passwordMismatch && (
                    <p className="text-sm text-red-600">
                        كلمة المرور غير متطابقة مع التأكيد.
                    </p>
                )}
            </div>

            {/* --- بداية التعديل --- */}
            <div>
                <Label>الدور</Label>
                <select
                    multiple
                    value={data.roles}
                    onChange={(e) => {
                        setData(
                            "roles",
                            Array.from(e.target.selectedOptions, (option) => option.value)
                        );
                    }}
                    className="w-full border rounded p-2"
                >
                    {Object.entries(roles).map(([value, label]) => {
                        // هنا هو التعديل: قارن بـ `label` بدلاً من `value`
                        if (label === "Admin" && !canAssign) {
                            return null; // لا تعرض خيار "Admin" إذا لم تكن لديك الصلاحية
                        }
                        return <option key={value} value={value}>{label}</option>;
                    })}
                </select>
                {errors.roles && <p className="text-sm text-red-600">{errors.roles}</p>}
            </div>
            {/* --- نهاية التعديل --- */}

            <div>
                <Label>المراكز</Label>
                <select
                    multiple
                    value={data.centers}
                    onChange={(e) =>
                        setData(
                            "centers",
                            Array.from(e.target.selectedOptions, (option) => Number(option.value))
                        )
                    }
                    className="w-full border rounded p-2"
                >
                    {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <Label>المجموعات</Label>
                <select
                    multiple
                    value={data.groups}
                    onChange={(e) =>
                        setData(
                            "groups",
                            Array.from(e.target.selectedOptions, (option) => Number(option.value))
                        )
                    }
                    className="w-full border rounded p-2"
                >
                    {groups.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <Label>الحارات المستهدفة - المبادرة</Label>
                <select
                    multiple
                    value={data.locations}
                    onChange={(e) =>
                        setData(
                            "locations",
                            Array.from(e.target.selectedOptions, (option) => Number(option.value))
                        )
                    }
                    className="w-full border rounded p-2"
                >
                    {locations.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="text-right">
                <Button type="submit" disabled={processing}>
                    {isEdit ? "حفظ التعديلات" : "حفظ المستخدم"}
                </Button>
            </div>
        </form>
    );
}

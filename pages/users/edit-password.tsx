import React, { useEffect, useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import { toast } from "sonner";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function EditPasswordPage() {
  const { flash, errors } = usePage().props as {
    flash?: { success?: string };
    errors: Record<string, string>;
  };

  const { data, setData, post, processing, reset } = useForm({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
      reset();
    }
  }, [flash]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("profile.password.update"));
  };

  return (
    <AppLayout breadcrumbs={[{ title: "تغيير كلمة المرور", href: "/profile/password" }]}>
      <div className="flex justify-between items-center mb-4 p-2">
        <h1 className="text-2xl font-bold">تغيير كلمة المرور</h1>
        <Button variant="secondary" onClick={() => router.visit("/dashboard")}>
          رجوع
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl p-2">
        {/* كلمة المرور الحالية */}
        <div>
          <Label htmlFor="current_password">كلمة المرور الحالية</Label>
          <div className="relative">
            <Input
              type={show.current ? "text" : "password"}
              name="current_password"
              value={data.current_password}
              onChange={(e) => setData("current_password", e.target.value)}
              className="pr-10"
              required
            />
            <span
              onClick={() => setShow((prev) => ({ ...prev, current: !prev.current }))}
              className="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 cursor-pointer"
            >
              {show.current ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.current_password && <p className="text-red-600 text-sm">{errors.current_password}</p>}
        </div>

        {/* كلمة المرور الجديدة */}
        <div>
          <Label htmlFor="new_password">كلمة المرور الجديدة</Label>
          <div className="relative">
            <Input
              type={show.new ? "text" : "password"}
              name="new_password"
              value={data.new_password}
              onChange={(e) => setData("new_password", e.target.value)}
              className="pr-10"
              required
            />
            <span
              onClick={() => setShow((prev) => ({ ...prev, new: !prev.new }))}
              className="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 cursor-pointer"
            >
              {show.new ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

        </div>

        {/* تأكيد كلمة المرور الجديدة */}
        <div>
          <Label htmlFor="new_password_confirmation">تأكيد كلمة المرور الجديدة</Label>
          <div className="relative">
            <Input
              type={show.confirm ? "text" : "password"}
              name="new_password_confirmation"
              value={data.new_password_confirmation}
              onChange={(e) => setData("new_password_confirmation", e.target.value)}
              className="pr-10"
              required
            />
            <span
              onClick={() => setShow((prev) => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute inset-y-0 left-0 flex items-center px-2 text-gray-500 cursor-pointer"
            >
              {show.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {errors.new_password && <p className="text-red-600 text-sm">{errors.new_password}</p>}
        </div>

        <div className="text-right">
          <Button type="submit" disabled={processing}>
            حفظ التغييرات
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
import { type SharedData } from '@/types';

import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AuthLayout from "@/layouts/auth-layout";

export default function Login() {
    
  const { flash, errors } = usePage().props as {
    flash?: { error?: string };
    flash?: { success?: string };

  };
  const { data, setData, post, processing } = useForm({
    name: "",
    password: "",
    remember_me: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("login"));
  };
  useEffect(() => {
    if (flash?.error) toast.error(flash.error);
    if (flash?.success) toast.success(flash.success);
  }, [flash]);


  return (
    <AuthLayout title="تسجيل الدخول" description="ادخل تفاصيل تسجيل الدخول">
      <Head title="تسجيل الدخول" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* رسالة خطأ عامة */}


              {/* اسم المستخدم */}
              <div>
                <Label htmlFor="name">اسم المستخدم</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="ادخل اسم المستخدم"
                  required
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* كلمة المرور */}
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className={errors.password ? "border-red-500" : ""}
                    placeholder="كلمة المرور"
                    required
                  />
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* تذكرني */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="remember_me"
                  checked={data.remember_me}
                  onCheckedChange={(checked) => setData("remember_me", !!checked)}
                />
                <Label htmlFor="remember_me">تذكرني</Label>
              </div>

              {/* زر تسجيل الدخول */}
              <Button type="submit" disabled={processing} className="w-full">
                تسجيل الدخول
              </Button>
            </form>



        </AuthLayout>
  );
}
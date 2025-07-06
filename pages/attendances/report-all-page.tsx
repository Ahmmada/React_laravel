import AppLayout from "@/layouts/app-layout";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AttendanceTable from "./partials/AttendanceTable"; // استيراد المكون الجديد للجدول
import { toast } from "sonner";
import { PageProps } from "@/types"; // تأكد من وجود تعريف لـ PageProps لديك

// تعريف الـ props التي سيتم تمريرها من Laravel
interface ReportAllPageProps extends PageProps {
    attendanceData: any[];
    dates: string[];
    from_date: string | null;
    to_date: string | null;
}

export default function ReportAllPage() {
    // استقبال البيانات من الخادم
    const { attendanceData, dates, from_date, to_date } = usePage<ReportAllPageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        from_date: from_date || "", // استخدام from_date القادمة من props أو قيمة افتراضية
        to_date: to_date || "",     // استخدام to_date القادمة من props أو قيمة افتراضية
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // إرسال البيانات إلى نفس المسار POST
        post(route("attendances.generateAllReport"), {
            onSuccess: () => {
                toast.success("تم توليد التقرير بنجاح.");
            },
            onError: (formErrors) => {
                if (Object.keys(formErrors).length > 0) {
                    toast.error("الرجاء التحقق من تواريخ البدء والانتهاء.");
                }
            },
        });
    };

    // لتنظيف النموذج وإعادة تحميل الصفحة (لإظهار النموذج فارغًا)
     const handleReset = () => {
        reset(); // تنظيف حقول النموذج
        // نقوم بزيارة GET لنفس المسار لإعادة تعيين بيانات الجدول من الخادم
        router.get(route("attendances.reportAllForm"), {}, {
            preserveState: false, // مهم جداً لضمان تحديث الـ props بالكامل
            preserveScroll: false, // لمنع الحفاظ على موقع التمرير
            onSuccess: () => {
                toast.info("تم إعادة تعيين التقرير.");
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: "تقرير حضور الطلاب", href: "/attendance-report/all" }]}>
            <Head title="تقرير الحضور - جميع الطلاب" />
            <div className="flex justify-between mb-4 p-2">
        <Button variant="secondary" onClick={() => router.get("/attendances")}>
          رجوع
        </Button>
                <Button variant="secondary" onClick={handleReset}>
                    إعادة تعيين
                </Button>
            </div>

            {/* نموذج البحث */}
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 mb-6 border rounded-lg shadow-sm">
                <div>
                    <label htmlFor="from_date" className="block text-sm font-medium text-gray-700 mb-1">من تاريخ</label>
                    <Input
                        id="from_date"
                        type="date"
                        value={data.from_date}
                        onChange={(e) => setData("from_date", e.target.value)}
                        className={errors.from_date ? "border-red-500" : ""}
                    />
                    {errors.from_date && <p className="text-red-500 text-xs mt-1">{errors.from_date}</p>}
                </div>

                <div>
                    <label htmlFor="to_date" className="block text-sm font-medium text-gray-700 mb-1">إلى تاريخ</label>
                    <Input
                        id="to_date"
                        type="date"
                        value={data.to_date}
                        onChange={(e) => setData("to_date", e.target.value)}
                        className={errors.to_date ? "border-red-500" : ""}
                    />
                    {errors.to_date && <p className="text-red-500 text-xs mt-1">{errors.to_date}</p>}
                </div>

                <div className="self-end">
                    <Button type="submit" disabled={processing} className="w-full">عرض التقرير</Button>
                </div>
            </form>

            {/* عرض الجدول فقط إذا كانت هناك بيانات */}
            {attendanceData && attendanceData.length > 0 ? (
                <AttendanceTable
                    attendanceData={attendanceData}
                    dates={dates}
                    from_date={from_date!} // استخدام ! للتأكيد أنه لن يكون null هنا
                    to_date={to_date!}   // استخدام ! للتأكيد أنه لن يكون null هنا
                />
            ) : (
                <div className="text-center p-10 text-gray-500">
                    <p>الرجاء تحديد فترة لإنشاء التقرير.</p>
                </div>
            )}
        </AppLayout>
    );
}
 
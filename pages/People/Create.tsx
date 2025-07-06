import { useForm, router, Head, usePage, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react"; // استيراد useState هنا
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"; // إذا كنت تستخدم Checkbox لمفتاح is_male و is_beneficiary
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; // لترتيب أفضل للنموذج


interface FormData {
    name: string;
    is_male: boolean;
    is_beneficiary: boolean;
    birth_date: string;
    card_type_id: number | null;
    card_number: string;
    phone_number: string;
    job: string;
    housing_type_id: number | null;
    housing_address: string;
    location_id: number | null;
    social_state_id: number | null;
    level_state_id: number | null;
    meal_count: number;
    male_count: number;
    female_count: number;
    notes: string;
    family_members: FamilyMemberData[];
}



interface Option {
    id: number;
    name: string;
}

interface PageProps {
    cardTypes: Option[];
    locations: Option[];
    housingTypes: Option[];
    socialStates: Option[];
    levelStates: Option[];
}

interface FamilyMemberData {
    id: number; // For temporary key in React list rendering
    birth_date: string;
    is_male: boolean;
}

export default function Create() {
    const { cardTypes, locations, housingTypes, socialStates, levelStates} = usePage<PageProps>().props;

const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: "",
        is_male: true, // افتراضيًا ذكر
        is_beneficiary: false, // افتراضيًا ليس مستفيدًا
        birth_date: "",
        card_type_id: null as number | null,
        card_number: "",
        phone_number: "",
        job: "",
        housing_type_id: null as number | null,
        housing_address: "",
        location_id: null as number | null,
        social_state_id: null as number | null,
        level_state_id: null as number | null,
        meal_count: 0,
        male_count: 0,
        female_count: 0,
        notes: "",
        family_members: [] as FamilyMemberData[],
    });

    const [nextFamilyMemberId, setNextFamilyMemberId] = useState(0);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
        }
    }, [errors]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("people.store"), {
            onSuccess: () => {
                toast.success("تم إضافة الشخص بنجاح.");
                reset(); // إعادة تعيين النموذج بعد النجاح
            },
            onError: (err) => {
                console.error(err);
                toast.error("حدث خطأ أثناء إضافة الشخص.");
            },
        });
    };

    const addFamilyMember = () => {
        setData((prevData) => ({
            ...prevData,
            family_members: [
                ...prevData.family_members,
                { id: nextFamilyMemberId, birth_date: "", is_male: true }, // إضافة ID مؤقت للـ key في React
            ],
        }));
        setNextFamilyMemberId((prevId) => prevId + 1);
    };

    const removeFamilyMember = (idToRemove: number) => {
        setData((prevData) => ({
            ...prevData,
            family_members: prevData.family_members.filter(
                (member) => member.id !== idToRemove
            ),
        }));
    };

    const handleFamilyMemberChange = (
        index: number,
        field: keyof Omit<FamilyMemberData, 'id'>, // استبعاد 'id' من المفتاح
        value: string | boolean
    ) => {
        const updatedMembers = data.family_members.map((member, i) =>
            i === index ? { ...member, [field]: value } : member
        );
        setData("family_members", updatedMembers);
    };

    return (
        <AppLayout>
            <Head title="إضافة شخص جديد" />

            <div className="container mx-auto py-8">
                <Card>
                    <CardHeader>
                        <CardTitle>إضافة شخص جديد</CardTitle>
                        <CardDescription>
                            يرجى ملء جميع الحقول المطلوبة لإضافة شخص.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* معلومات الشخص الأساسية */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">الاسم الكامل</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="birth_date">تاريخ الميلاد</Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData("birth_date", e.target.value)}
                                    />
                                    {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_male"
                                        checked={data.is_male}
                                        onCheckedChange={(checked) => setData("is_male", Boolean(checked))}
                                    />
                                    <Label htmlFor="is_male">ذكر</Label>
                                    {errors.is_male && <p className="text-red-500 text-sm mt-1">{errors.is_male}</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_beneficiary"
                                        checked={data.is_beneficiary}
                                        onCheckedChange={(checked) => setData("is_beneficiary", Boolean(checked))}
                                    />
                                    <Label htmlFor="is_beneficiary">مستفيد</Label>
                                    {errors.is_beneficiary && <p className="text-red-500 text-sm mt-1">{errors.is_beneficiary}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="social_state_id">الحالة الاجتماعية</Label>
                                    <Select
                                        value={data.social_state_id ? String(data.social_state_id) : ""}
onValueChange={(value) => setData("social_state_id", value === "" ? null : Number(value))}                          
                                    >
                                        <SelectTrigger id="social_state_id">
                                            <SelectValue placeholder="اختر الحالة الاجتماعية" />
                                        </SelectTrigger>
                                        <SelectContent>

                  {socialStates.map((type) => (
                                                <SelectItem key={type.id} value={String(type.id)}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.social_state_id && <p className="text-red-500 text-sm mt-1">{errors.social_state_id}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="male_count">عدد الذكور في الأسرة (غير أفراد الأسرة)</Label>
                                    <Input
                                        id="male_count"
                                        type="number"
                                        min="0"
                                        value={data.male_count}
                                        onChange={(e) => setData("male_count", Math.max(0, parseInt(e.target.value) || 0))}
                                        required
                                    />
                                    {errors.male_count && <p className="text-red-500 text-sm mt-1">{errors.male_count}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="female_count">عدد الإناث في الأسرة (غير أفراد الأسرة)</Label>
                                    <Input
                                        id="female_count"
                                        type="number"
                                        min="0"
                                        value={data.female_count}
                                        onChange={(e) => setData("female_count", parseInt(e.target.value) || 0)}
                                        required
                                    />
                                    {errors.female_count && <p className="text-red-500 text-sm mt-1">{errors.female_count}</p>}
                                </div>
                            </div>

                            {/* معلومات الاتصال والعمل */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone_number">رقم الهاتف</Label>
                                    <Input
                                        id="phone_number"
                                        type="text"
                                        value={data.phone_number}
                                        onChange={(e) => setData("phone_number", e.target.value)}
                                    />
                                    {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="job">الوظيفة</Label>
                                    <Input
                                        id="job"
                                        type="text"
                                        value={data.job}
                                        onChange={(e) => setData("job", e.target.value)}
                                    />
                                    {errors.job && <p className="text-red-500 text-sm mt-1">{errors.job}</p>}
                                </div>
                            </div>

                            {/* معلومات البطاقة والسكن والمركز - حقول Select */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="card_type_id">نوع البطاقة</Label>
                                    <Select
                                        value={data.card_type_id ? String(data.card_type_id) : ""}
onValueChange={(value) => setData("card_type_id", value === "" ? null : Number(value))}
                                        
                                    >
                                        <SelectTrigger id="card_type_id">
                                            <SelectValue placeholder="اختر نوع البطاقة" />
                                        </SelectTrigger>
                                        <SelectContent>

                                            {cardTypes.map((type) => (
                                                <SelectItem key={type.id} value={String(type.id)}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.card_type_id && <p className="text-red-500 text-sm mt-1">{errors.card_type_id}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="card_number">رقم البطاقة</Label>
                                    <Input
                                        id="card_number"
                                        type="text"
                                        value={data.card_number}
                                        onChange={(e) => setData("card_number", e.target.value)}
                                    />
                                    {errors.card_number && <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="housing_type_id">نوع السكن</Label>
                                    <Select
                                        value={data.housing_type_id ? String(data.housing_type_id) : ""}
onValueChange={(value) => setData("housing_type_id", value === "" ? null : Number(value))}                          
                                    >
                                        <SelectTrigger id="housing_type_id">
                                            <SelectValue placeholder="اختر نوع السكن" />
                                        </SelectTrigger>
                                        <SelectContent>

                  {housingTypes.map((type) => (
                                                <SelectItem key={type.id} value={String(type.id)}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.housing_type_id && <p className="text-red-500 text-sm mt-1">{errors.housing_type_id}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="housing_address">عنوان السكن</Label>
                                    <Input
                                        id="housing_address"
                                        type="text"
                                        value={data.housing_address}
                                        onChange={(e) => setData("housing_address", e.target.value)}
                                    />
                                    {errors.housing_address && <p className="text-red-500 text-sm mt-1">{errors.housing_address}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="location_id">المركز</Label>
                                    <Select
                                        value={data.location_id ? String(data.location_id) : ""}
                                        onValueChange={(value) => setData("location_id", value === "" ? null : Number(value))}
                                    >
                                        <SelectTrigger id="location_id">
                                            <SelectValue placeholder="اختر المركز" />
                                        </SelectTrigger>
                                        <SelectContent>
                   {locations.map((location) => (
                                                <SelectItem key={location.id} value={String(location.id)}>
                                                    {location.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="level_state_id">مستوى الحالة </Label>
                                    <Select
                                        value={data.level_state_id ? String(data.level_state_id) : ""}
onValueChange={(value) => setData("level_state_id", value === "" ? null : Number(value))}                          
                                    >
                                        <SelectTrigger id="level_state_id">
                                            <SelectValue placeholder="اختر مستوى الحالة " />
                                        </SelectTrigger>
                                        <SelectContent>

                  {levelStates.map((type) => (
                                                <SelectItem key={type.id} value={String(type.id)}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.level_state_id && <p className="text-red-500 text-sm mt-1">{errors.level_state_id}</p>}
                                </div>
<div>
                                    <Label htmlFor="meal_count">عدد الحالات</Label>
                                    <Input
                                        id="meal_count"
                                        type="number"
                                        min="0"
                                        value={data.meal_count}
                                        onChange={(e) => setData("meal_count", Math.max(0, parseInt(e.target.value) || 0))}
                                        required
                                    />
                                    {errors.meal_count && <p className="text-red-500 text-sm mt-1">{errors.meal_count}</p>}
</div>
                            </div>

                            {/* الملاحظات */}
                            <div>
                                <Label htmlFor="notes">الملاحظات</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes || ""}
                                    onChange={(e) => setData("notes", e.target.value)}
                                />
                                {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                            </div>

                            {/* أفراد الأسرة */}
<div className="space-y-4 pt-6 border-t mt-6">
    <h3 className="text-lg font-semibold">أفراد الأسرة التابعين</h3>

    <div className="overflow-x-auto">
        <table className="min-w-full border text-sm text-right">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border px-4 py-2">#</th>
                    <th className="border px-4 py-2">تاريخ الميلاد</th>
                    <th className="border px-4 py-2">ذكر؟</th>
                    <th className="border px-4 py-2">إجراء</th>
                </tr>
            </thead>
            <tbody>
                {data.family_members.map((member, index) => (
                    <tr key={`member-${index}`} className="hover:bg-gray-50">
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                            <Input
                                type="date"
                                id={`member-birth_date-${index}`}
                                value={member.birth_date}
                                onChange={(e) => handleFamilyMemberChange(index, "birth_date", e.target.value)}
                                required
                                className="w-full"
                            />
                            {errors[`family_members.${index}.birth_date`] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors[`family_members.${index}.birth_date`]}
                                </p>
                            )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                            <Checkbox
                                id={`member-is_male-${index}`}
                                checked={member.is_male}
                                onCheckedChange={(checked) =>
                                    handleFamilyMemberChange(index, "is_male", Boolean(checked))
                                }
                            />
                            {errors[`family_members.${index}.is_male`] && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors[`family_members.${index}.is_male`]}
                                </p>
                            )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFamilyMember(index)}
                            >
                                حذف
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>

    <div className="mt-4">
        <Button type="button" onClick={addFamilyMember}>
            إضافة فرد أسرة جديد
        </Button>
    </div>

    {errors.family_members && (
        <p className="text-red-500 text-sm mt-1">{errors.family_members}</p>
    )}
</div>
                            <div className="flex justify-end gap-2 mt-8">
                                <Button type="submit" disabled={processing}>
                                    {processing ? "جاري الإضافة..." : "إضافة الشخص"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.visit(route('people.report.view'))}>
                                    إلغاء
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


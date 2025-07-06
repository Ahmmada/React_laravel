import { useForm, router, Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PersonForm from "./partials/PersonForm";
import { PersonFormData, Option } from "./partials/types";

interface PageProps {
    cardTypes: Option[];
    locations: Option[];
    housingTypes: Option[];
    socialStates: Option[];
    levelStates: Option[];
    flash?: { success?: string; errors?: any };
}

export default function Create() {
    const { cardTypes, locations, housingTypes, socialStates, levelStates, flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm<PersonFormData>({
        name: "",
        is_male: true,
        is_beneficiary: false,
        birth_date: "",
        card_type_id: null,
        card_number: "",
        phone_number: "",
        job: "",
        housing_type_id: null,
        housing_address: "",
        location_id: null,
        social_state_id: null,
        level_state_id: null,
        meal_count: 0,
        male_count: 0,
        female_count: 0,
        notes: "",
        family_members: [],
    });

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.errors) {
            Object.values(flash.errors).forEach((error: any) => {
                toast.error(error);
            });
        }
    }, [flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("people.store"), {
            onSuccess: () => {
                toast.success("تم إضافة الشخص بنجاح.");
                reset();
            },
            onError: (err) => {
                console.error(err);
                toast.error("حدث خطأ أثناء إضافة الشخص.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: "قائمة الأشخاص", href: "/people/report" },
            { title: "إضافة شخص جديد", href: "/people/create" }
        ]}>
            <Head title="إضافة شخص جديد" />

            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">إضافة شخص جديد</h1>
                    <Button 
                        variant="outline" 
                        onClick={() => router.visit(route('people.report.view'))}
                    >
                        العودة للقائمة
                    </Button>
                </div>

                <Card className="max-w-6xl mx-auto">
                    <CardHeader>
                        <CardTitle>بيانات الشخص</CardTitle>
                        <CardDescription>
                            يرجى ملء جميع الحقول المطلوبة لإضافة شخص جديد.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <PersonForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                cardTypes={cardTypes}
                                locations={locations}
                                housingTypes={housingTypes}
                                socialStates={socialStates}
                                levelStates={levelStates}
                            />

                            <div className="flex justify-end gap-4 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('people.report.view'))}
                                >
                                    إلغاء
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "جاري الحفظ..." : "حفظ البيانات"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
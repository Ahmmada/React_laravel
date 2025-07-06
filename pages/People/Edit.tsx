import { useForm, router, Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PersonForm from "./partials/PersonForm";
import { PersonFormData, Option, FamilyMember } from "./partials/types";

interface PersonData {
    id: number;
    name: string;
    is_male: boolean;
    is_beneficiary: boolean;
    birth_date: string | null;
    card_type_id: number | null;
    card_number: string | null;
    phone_number: string | null;
    job: string | null;
    housing_type_id: number | null;
    housing_address: string | null;
    location_id: number | null;
    social_state_id: number | null;
    level_state_id: number | null;
    meal_count: number;
    male_count: number;
    female_count: number;
    notes: string | null;
    family_members: FamilyMember[];
}

interface PageProps {
    person: PersonData;
    cardTypes: Option[];
    locations: Option[];
    housingTypes: Option[];
    socialStates: Option[];
    levelStates: Option[];
    flash?: { success?: string; errors?: any };
}

export default function Edit() {
    const { person, cardTypes, locations, housingTypes, socialStates, levelStates, flash } = usePage<PageProps>().props;

    const { data, setData, put, processing, errors } = useForm<PersonFormData>({
        name: person.name,
        is_male: person.is_male,
        is_beneficiary: person.is_beneficiary,
        birth_date: person.birth_date ? new Date(person.birth_date).toISOString().split('T')[0] : "",
        card_type_id: person.card_type_id,
        card_number: person.card_number || "",
        phone_number: person.phone_number || "",
        job: person.job || "",
        housing_type_id: person.housing_type_id,
        housing_address: person.housing_address || "",
        location_id: person.location_id,
        social_state_id: person.social_state_id,
        level_state_id: person.level_state_id,
        meal_count: person.meal_count,
        male_count: person.male_count,
        female_count: person.female_count,
        notes: person.notes || "",
        family_members: person.family_members.map(member => ({
            ...member,
            birth_date: member.birth_date ? new Date(member.birth_date).toISOString().split('T')[0] : "",
        })),
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
        put(route("people.update", person.id), {
            onSuccess: () => {
                toast.success("تم تحديث بيانات الشخص بنجاح.");
            },
            onError: (err) => {
                console.error(err);
                toast.error("حدث خطأ أثناء تحديث بيانات الشخص.");
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: "قائمة الأشخاص", href: "/people/report" },
            { title: `تعديل: ${person.name}`, href: `/people/${person.id}/edit` }
        ]}>
            <Head title={`تعديل: ${person.name}`} />

            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">تعديل بيانات: {person.name}</h1>
                    <Button 
                        variant="outline" 
                        onClick={() => router.visit(route('people.report.view'))}
                    >
                        العودة للقائمة
                    </Button>
                </div>

                <Card className="max-w-6xl mx-auto">
                    <CardHeader>
                        <CardTitle>تعديل بيانات الشخص</CardTitle>
                        <CardDescription>
                            يرجى تعديل الحقول المطلوبة ثم حفظ التغييرات.
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
                                isEdit={true}
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
                                    {processing ? "جاري الحفظ..." : "حفظ التعديلات"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
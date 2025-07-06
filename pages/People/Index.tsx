import { Head, Link, usePage, router } from "@inertiajs/react";
import { useEffect, useRef, useState, useMemo, useCallback } from 'react'; // استيراد Hooks إضافية
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { ModuleRegistry } from 'ag-grid-community'; 
import { AllEnterpriseModule } from 'ag-grid-enterprise';
ModuleRegistry.registerModules([AllEnterpriseModule]);
import { AG_GRID_LOCALE_EG } from "@/locales/ar.ts";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";



interface CardType {
    id: number;
    name: string;
}

interface HousingType {
    id: number;
    name: string;
}

interface SocialState {
    id: number;
    name: string;
}

interface LevelState {
    id: number;
    name: string;
}

interface Center {
    id: number;
    name: string;
}

interface FamilyMember {
    id: number;
    birth_date: string;
    is_male: boolean;
}

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
    center_id: number | null;
    social_state_id: number | null;
    level_state_id: number | null;
    meal_count: number;
    male_count: number;
    female_count: number;
    notes: string | null;
    created_at: string;
    card_type: CardType | null;
    housing_type: HousingType | null;
    social_state: SocialState | null;
    levelState: LevelState | null;
    center: Center | null;
    family_members: FamilyMember[];
}

interface PageProps {
    people: PersonData[];
}

// **ActionsCellRenderer لم يعد يستقبل handleDelete أو isDeleteDialogOpen**
// بدلاً من ذلك، سيقوم بتشغيل دالات من الـ props التي سيتم تمريرها من المكون الأب
interface ActionsCellRendererProps extends ICellRendererParams<PersonData> {
    onEdit: (id: number) => void;
    onDeleteRequest: (id: number, name: string) => void;
}

const ActionsCellRenderer = (params: ActionsCellRendererProps) => {
    const person = params.data;

    if (!person) {
        return null;
    }

    return (
        <div className="flex space-x-2 h-full items-center justify-center">
            <Button
                variant="outline"
                size="xs" // غيرت الحجم إلى xs كما طلبت
                onClick={() => params.onEdit(person.id)} // استدعاء دالة التعديل من الـ props
            >
                تعديل
            </Button>
            <Button
                size="xs" // غيرت الحجم إلى xs كما طلبت
                variant="destructive"
                onClick={() => params.onDeleteRequest(person.id, person.name)} // استدعاء دالة طلب الحذف من الـ props
            >
                حذف
            </Button>
        </div>
    );
};


export default function Index() {
  const { people, flash } = usePage().props as {
    people: Person[];
    flash?: { success?: string };
  };

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);

    const gridRef = useRef<AgGridReact<PersonData>>(null);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);

    // **الحالة الجديدة للتحكم في Dialog الحذف**
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
    const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");

    // دالة لفتح Dialog الحذف
    const handleDeleteRequest = (id: number, name: string) => {
        setConfirmDeleteId(id);
        setConfirmDeleteName(name);
    };

    // دالة لمعالجة الحذف الفعلي بعد التأكيد
    const handleDelete = (id: number) => {
        setConfirmDeleteId(null); // إغلاق Dialog فوراً
        setConfirmDeleteName(""); // مسح الاسم

        router.delete(route('people.destroy', id), {
            onSuccess: () => {
                toast.success(`تم الحذف ${confirmDeleteName} بنجاح.`);
                // Inertia ستعيد تحميل الـ props، و AG-Grid سيحدث تلقائيًا
            },
            onError: (error) => {
                console.error("خطأ في الحذف:", error);
                toast.error(`فشل الحذف ${confirmDeleteName}.`);
            },
        });
    };

    // دالة لمعالجة التعديل (يمكن أن تكون بسيطة، أو أكثر تعقيداً إذا كان هناك منطق إضافي)
    const handleEdit = (id: number) => {
        router.get(route('people.edit', id));
    };


    // تعريفات الأعمدة (ColDef) لـ AG-Grid
    const [columnDefs] = useState<ColDef<PersonData>[]>([
        { headerName: 'ID', field: 'id',             minWidth: 50, width: 50,             resizable: false,
            sortable: false,
          pinned: 'right' },
        { headerName: 'الاسم', field: 'name',             minWidth: 180, width: 200, filter: true, sortable: true , suppressHeaderMenuButton: false,},
        
{
    headerName: 'ذكر؟',
    field: 'is_male',
    width: 100,
    filter: 'agSetColumnFilter',
    sortable: true,
    valueFormatter: (params) => params.value == 1 ? 'ذكر' : 'انثى',
    filterParams: {
        keyCreator: (params) => params.value,
        valueFormatter: (params) => params.value == 1 ? 'ذكر' : 'انثى'
    }
}
        ,
        {
            headerName: 'مستفيد؟',
            field: 'is_beneficiary',
            width: 120,
            cellDataType: false,
            valueFormatter: (params) => (params.value ? 'مستفيد' : 'غير مستفيد'),
            filter: true,
            sortable: true
        },
        
  { headerName: "تاريخ الميلاد", field: "birth_date", filter: true, sortable: true, width: 120  ,suppressHeaderMenuButton: true},
        {
            headerName: 'نوع البطاقة',
            field: 'card_type.name', // مسار للوصول إلى الاسم من العلاقة
            width: 150,
            filter: true,
            sortable: true,
            // استخدام valueGetter لعرض اسم نوع البطاقة بشكل صحيح إذا لم يكن موجودًا مباشرة
            valueGetter: (params) => params.data?.card_type?.name || 'غير محدد',
        },
        { headerName: 'رقم البطاقة', field: 'card_number', width: 150, filter: true, sortable: true },
        { headerName: 'رقم الهاتف', field: 'phone_number', width: 150, filter: true, sortable: true },
        { headerName: 'الوظيفة', field: 'job', width: 150, filter: true, sortable: true },
        {
            headerName: 'الحالة الاجتماعية',
            field: 'social_state.name',
            width: 150,
            filter: true,
            sortable: true,
            valueGetter: (params) => params.data?.social_state?.name || 'غير محدد',
        },
        {
            headerName: 'نوع السكن',
            field: 'housing_type.name',
            width: 150,
            filter: true,
            sortable: true,
            valueGetter: (params) => params.data?.housing_type?.name || 'غير محدد',
        },
        { headerName: 'عنوان السكن', field: 'housing_address', width: 200, filter: true, sortable: true },
        {
            headerName: 'المركز',
            field: 'center.name',
            width: 150,
            filter: true,
            sortable: true,
            valueGetter: (params) => params.data?.center?.name || 'غير محدد',
        },
        { headerName: 'عدد الحالات', field: 'meal_count', width: 120, filter: true, sortable: true },
        { headerName: 'عدد الذكور', field: 'male_count', width: 120, filter: true, sortable: true },
        { headerName: 'عدد الإناث', field: 'female_count', width: 120, filter: true, sortable: true },
        {
            headerName: ' مستوى الحالة',
            field: 'level_state.name',
            width: 150,
            filter: true,
            sortable: true,
            valueGetter: (params) => params.data?.level_state?.name || 'غير محدد',
        },
        { headerName: 'الملاحظات', field: 'notes', width: 250, filter: true, sortable: true },
        {
            headerName: 'أفراد الأسرة',
            field: 'family_members',
            width: 200,
            filter: false, // لا نريد فلترة على هذا العمود مباشرة
            sortable: false,
            // لعرض عدد أفراد الأسرة أو قائمة مختصرة
            valueGetter: (params) => {
                if (!params.data || !params.data.family_members) return 'لا يوجد';
                const count = params.data.family_members.length;
                return count > 0 ? `${count} أفراد` : 'لا يوجد';
            },
            // يمكنك استخدام cellRenderer لعرضهم بشكل أكثر تفصيلاً إذا أردت
        },
        {
            headerName: 'تاريخ الإنشاء',
            field: 'created_at',
            width: 180,
            filter: true,
            sortable: true,
            valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString('ar-MA') : ''
        },
        {
            headerName: 'الإجراءات',
            width: 150,
            cellRenderer: ActionsCellRenderer, // استخدام المكون المخصص
            resizable: false,
            sortable: false,
            filter: false,
            // **تمرير الدالات إلى cellRendererParams**
            cellRendererParams: {
                onEdit: handleEdit,
                onDeleteRequest: handleDeleteRequest,
            }
        }
    ]);

    // الإعدادات الافتراضية لجميع الأعمدة
    const defaultColDef = useMemo<ColDef>(() => {
        return {
            flex: 1, // اجعل الأعمدة تتمدد لتملأ المساحة
            minWidth: 100,
            suppressHeaderMenuButton: true,
            floatingFilter: true, // إضافة حقول فلترة أسفل رؤوس الأعمدة
            resizable: true,
        };
    }, []);


    const onGridReady = useCallback((params: any) => {
        setGridApi(params.api);
    }, []);

    useEffect(() => {
        if (gridApi) {
            gridApi.sizeColumnsToFit();
        }
    }, [gridApi, people]); // أعد تشغيل عند تغيير البيانات أو تهيئة الشبكة

    return (

    <AppLayout breadcrumbs={[{ title: "قائمة البيانات", href: "/people" }]}>
      <Head title="قائمة البيانات" />

            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-6 p-2">
                    <h1 className="text-2xl font-bold">قائمة البيانات</h1>
                    <Link href={route('people.create')}>
                        <Button>إضافة شخص جديد</Button>
                    </Link>
                </div>

                {/* حاوية AG-Grid */}
                <div className="ag-theme-quartz" style={{ height: 600, width: '100%' }}>
                    <AgGridReact
                        ref={gridRef}
                        rowData={people} // البيانات التي ستعرض في الجدول
                        columnDefs={columnDefs} // تعريفات الأعمدة
                        defaultColDef={defaultColDef} // الإعدادات الافتراضية للأعمدة
                        onGridReady={onGridReady} // دالة لاستدعائها عند تهيئة الشبكة
                        pagination={true} // تفعيل التصفح
                        paginationPageSize={10} // عدد الصفوف في كل صفحة
                        paginationPageSizeSelector={[10, 25, 50, 100]} // خيارات عدد الصفوف
                        animateRows={true} // تفعيل الرسوم المتحركة للصفوف
 
                        enableRtl={true}
                        localeText={AG_GRID_LOCALE_EG}
                        
                        />
                        
                        
                </div>
            </div>

            {/* Dialog الحذف المركزي */}
            <Dialog
                open={confirmDeleteId !== null} // يفتح الـ Dialog إذا كان هناك ID للحذف
                onOpenChange={(open) => {
                    if (!open) { // إذا تم إغلاق الـ Dialog (سواء بالنقر خارجًا أو بالضغط على Esc)
                        setConfirmDeleteId(null);
                        setConfirmDeleteName("");
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>تأكيد الحذف</DialogTitle>
                        <DialogDescription>
                            هل أنت متأكد أنك تريد حذف الشخص "
                            <span className="font-semibold">{confirmDeleteName}</span>"؟
                            سيؤدي هذا الإجراء إلى حذف جميع البيانات المرتبطة به بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setConfirmDeleteId(null); // لإغلاق الـ Dialog
                                setConfirmDeleteName("");
                            }}
                        >
                            إلغاء
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleDelete(confirmDeleteId!)} // استخدم confirmDeleteId! لأنه مضمون أنه ليس null هنا
                        >
                            تأكيد الحذف
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}







import {
    Head,
    Link,
    usePage,
    router,
   
} from "@inertiajs/react";
import {
    useEffect,
    useRef,
    useState,
    useMemo,
    useCallback
} from 'react';
import AppLayout from "@/layouts/app-layout";
import {
    Button
} from "@/components/ui/button";
import {
    AgGridReact,
    AgGridReactProps
} from "ag-grid-react";
import {
    ModuleRegistry
} from 'ag-grid-community';
import {
    AllEnterpriseModule
} from 'ag-grid-enterprise';
import {
    AG_GRID_LOCALE_EG
} from "@/locales/ar.ts";
import {
    toast
} from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Checkbox
} from "@/components/ui/checkbox";
import ThemedAgGrid from "@/components/shared/themed-ag-grid";

ModuleRegistry.registerModules([AllEnterpriseModule]);



const ActionsCellRenderer = (params: ActionsCellRendererProps) => {
    const person = params.data;

    if (!person) {
        return null;
    }

    return (
        <div className="flex space-x-2 h-full items-center justify-center">
            <Button
            variant="outline"
            size="xs"
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

export default function PeopleIndex() {
    const {
        people,
        flash
    } = usePage().props as {
        people: Person[];
        flash?: {
            success?: string
        };
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    },
        [flash]);

    const gridRef = useRef < AgGridReact < PersonData>>(null);
    const [gridApi, setGridApi] = useState < GridApi | null > (null);


    const [confirmDeleteId, setConfirmDeleteId] = useState < number | null > (null);
    const [confirmDeleteName, setConfirmDeleteName] = useState < string > ("");

    // دالة لفتح Dialog الحذف
    const handleDeleteRequest = (id: number,
        name: string) => {
        setConfirmDeleteId(id);
        setConfirmDeleteName(name);
    };

    // دالة لمعالجة الحذف الفعلي بعد التأكيد
    const handleDelete = (id: number) => {
        setConfirmDeleteId(null); // إغلاق Dialog فوراً
        setConfirmDeleteName(""); // مسح الاسم

        router.delete(route('people.destroy', id),
            {
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

    // دالة لمعالجة التعديل
    const handleEdit = (id: number) => {
        router.get(route('people.edit', id));
    };



    const allColumns = [
        {
        headerName: 'الاسم', field: 'name', minWidth: 180, width: 200, filter: true, sortable: true, suppressHeaderMenuButton: false,
        },
        {
            headerName: "ذكر / انثى",
            filter: true, 
            field: "is_male", valueFormatter: (params) => (params.value ? 'ذكر': 'انثى'),
            filterParams: {
                keyCreator: (params) => params.value,
                valueFormatter: (params) => params.value == 1 ? 'ذكر': 'انثى'
            }
        },
        {
            headerName: "تاريخ الميلاد", field: "birth_date"
        },
        {
            headerName: "مستفيد/غير مستفيد",
            field: "is_beneficiary",
            filter: true, 
            valueFormatter: (params) => (params.value ? 'مستفيد': 'غير مستفيد'),
            filterParams: {
                keyCreator: (params) => params.value,
                valueFormatter: (params) => params.value == 1 ? 'مستفيد': 'غير مستفيد'
            }
        },
        {
            headerName: "الحارة ",
            field: "location.name",
            width: 200,
            filter: true,
            sortable: true,
        },
        {
            headerName: 'عنوان السكن',
            field: 'housing_address',
            width: 200,
            filter: true,
            sortable: true
        },
        {
            headerName: "الهاتف",
            field: "phone_number",
            minWidth: 110, 
        },
        {
            headerName: "نوع السكن",
            field: "housing_type.name",
            minWidth: 100, 
        },
        {
            headerName: "نوع البطاقة", field: "card_type.name"
        },
        {
            headerName: 'رقم البطاقة',
            field: 'card_number',
            minWidth: 120, 
            filter: true,
            sortable: true
        },
        {
            headerName: "المهنة", field: "job"
        },
        {
            headerName: 'الحالة الاجتماعية',
            field: 'social_state.name',
            width: 150,
            filter: true,
            sortable: true,
        },
        {
            headerName: ' مستوى الحالة',
            field: 'level_state.name',
            width: 150,
            filter: true,
            sortable: true,
        },
        { headerName: 'عدد الحالات', field: 'meal_count', width: 120 },
        {
            headerName: "عدد الذكور", field: "male_count"
        },
        {
            headerName: "عدد الإناث", field: "female_count"
        },
       {
            headerName: 'أفراد الأسرة',
            field: 'family_members',
            width: 200,
            filter: false,
            // لا نريد فلترة على هذا العمود مباشرة
            sortable: false,
            // لعرض عدد أفراد الأسرة أو قائمة مختصرة
            valueGetter: (params) => {
                if (!params.data || !params.data.family_members) return 'لا يوجد';
                const count = params.data.family_members.length;
                return count > 0 ? `${count} أفراد`: 'لا يوجد';
            },
        },
        {
            headerName: "ملاحظات", field: "notes"
        },
    ];
    const idColumn = {
        headerName: 'ID', field: 'id', minWidth: 50, width: 50, resizable: true,
        sortable: true,
        pinned: 'right'
    };
    const actionsColumn = {
        headerName: 'الإجراءات',
        width: 150,
        minWidth: 120, 
        cellRenderer: ActionsCellRenderer, // مكون الإجراءات
        resizable: false,
        sortable: false,
        filter: false,
        cellRendererParams: {
            onEdit: handleEdit,
            onDeleteRequest: handleDeleteRequest,
        },
    };

    // ➊ أسماء الحقول الافتراضية
    const defaultFields = ['name', 'birth_date', 'phone_number'];

    // ➋ محاولة جلب الحقول المختارة من localStorage
    let savedFields;
    try {
        savedFields = JSON.parse(localStorage.getItem('selectedColumns'));
    } catch (e) {
        savedFields = null;
    }

    // ➌ تحديد الحقول المعروضة: من localStorage أو الافتراضية
    const fieldsToShow = Array.isArray(savedFields) && savedFields.length > 0
    ? savedFields: defaultFields;

    // ➍ استخراج الأعمدة المناسبة من allColumns
    const columnDefs = [
        idColumn,
        ...allColumns.filter(col => fieldsToShow.includes(col.field)),
        actionsColumn // عمود الإجراءات
    ];

    // الإعدادات الافتراضية لجميع الأعمدة
    const defaultColDef = useMemo < ColDef > (() => {
        return {
            flex: 1,
            // اجعل الأعمدة تتمدد لتملأ المساحة
            minWidth: 80,
            suppressHeaderMenuButton: true,
            floatingFilter: true,
            // إضافة حقول فلترة أسفل رؤوس الأعمدة
            resizable: true,
        };
    },
        []);


    const onGridReady = useCallback((params: any) => {
        setGridApi(params.api);
    },
        []);

    useEffect(() => {
        if (gridApi) {
            gridApi.sizeColumnsToFit();
        }
    },
        [gridApi,
            people]); // أعد تشغيل عند تغيير البيانات أو تهيئة الشبكة


    return (

        <AppLayout breadcrumbs={[{ title: "قائمة البيانات",
            href: "/people" }]}>
      <Head title="قائمة البيانات" />

                <div className="flex justify-between items-center mb-6 p-2">
                    <h1 className="text-2xl font-bold">قائمة البيانات</h1>
                    <Link href={route('people.create')}>
                        <Button>إضافة شخص جديد</Button>
                    </Link>
        </div>

    <div className="ag-theme-alpine" style={ {}}>
    
            <div className="overflow-x-auto bg-gray dark:bg-gray-700">
                        <form
  method="POST"
  encType="multipart/form-data"
  action={route("people.import")}
>
                <table className="min-w-full border text-sm text-right">
            <tbody className="bg-gray dark:bg-gray-700">

                    <tr className="hover:bg-gray-50">
                        <td className="border px-0.5 py-0 text-center"> 

  {/* تمرير CSRF token من الميتا */}
  <input
    type="hidden"
    name="_token"
    value={
      document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
    }
  />

  <input         className="border rounded px-2 py-1 w-[200px]"  type="file" name="file" accept=".xlsx, .xls" required /></td>
                        <td className="border px-0 py-0 text-center">
  <Button variant="secondary" type="submit" size="xs" >استيراد من Excel</Button>

                        </td>
                        <td className="border px-0 py-0.5 text-center">
                    <Link href={route('people.columns.edit')}>
                        <Button size="xs"
                    variant="secondary">إختيار الاعمدة</Button>
                    </Link>
                        </td>
                    </tr>
                </tbody>
                </table>
</form>
            </div>

    <ThemedAgGrid
                rowData={people}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                pagination={true}
                paginationPageSize={25}
                paginationPageSizeSelector={[10,
                    25,
                    50,
                    100]}
                animateRows={true}
                enableRtl={true}
                localeText={AG_GRID_LOCALE_EG}
                domLayout="autoHeight"
                />

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
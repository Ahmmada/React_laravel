// resources/js/pages/People/PeopleSearchPage.tsx

import { Head, useForm, usePage, router } from "@inertiajs/react";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import AppLayout from "@/layouts/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// لن نستخدم أي شيء من shadcn/ui Select بعد الآن لهذه الحقول
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ThemedAgGrid from "@/components/shared/themed-ag-grid";
import { toast } from "sonner";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry } from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";

ModuleRegistry.registerModules([AllEnterpriseModule]);

interface Option {
  id: number;
  name: string;
}

interface PeopleSearchPageProps {
  cardTypes: Option[];
  housingTypes: Option[];
  centers: Option[];
  socialStates: Option[];
  levelStates: Option[];
  people: any[];
  pagination: any;
  searchParams: any;
}

const ActionsCellRenderer = (params: any) => {
  const person = params.data;
  if (!person) return null;
  return (
    <div className="flex space-x-2 h-full items-center justify-center">
      <Button
        variant="outline"
        size="xs"
        onClick={() => router.get(route("people.edit", person.id))}
      >
        تعديل
      </Button>
      <Button
        size="xs"
        variant="destructive"
        onClick={() => {
          if (confirm(`هل أنت متأكد من حذف ${person.name}؟`)) {
            router.delete(route("people.destroy", person.id));
          }
        }}
      >
        حذف
      </Button>
    </div>
  );
};

export default function PeopleSearchPage() {
  const {
    cardTypes,
    housingTypes,
    centers,
    socialStates,
    levelStates,
    people,
    pagination,
    searchParams,
  } = usePage<PeopleSearchPageProps>().props;

  // دالة مساعدة لتحويل قيمة مفردة أو null إلى مصفوفة من الأرقام
  const toMultiSelectNumberArray = (value: any): number[] => {
    if (Array.isArray(value)) {
      // إذا كانت بالفعل مصفوفة، حول عناصرها لأرقام
      return value.map(Number);
    }
    if (value === null || value === undefined || value === "") {
      // إذا كانت null أو undefined أو فارغة، أعد مصفوفة فارغة
      return [];
    }
    // إذا كانت قيمة مفردة (مثل ID واحد)، حولها إلى مصفوفة تحتوي هذا الرقم
    return [Number(value)];
  };

  const initialParams = useMemo(
    () => ({
      search_name: searchParams?.search_name ?? "",
      // تحويل القيم إلى مصفوفة من الأرقام لكل حقل اختيار متعدد
      card_type_id: toMultiSelectNumberArray(searchParams?.card_type_id),
      housing_type_id: toMultiSelectNumberArray(searchParams?.housing_type_id),
      center_id: toMultiSelectNumberArray(searchParams?.center_id),
      social_state_id: toMultiSelectNumberArray(searchParams?.social_state_id),
      level_state_id: toMultiSelectNumberArray(searchParams?.level_state_id),
      is_male:
        searchParams?.is_male !== undefined && searchParams.is_male !== null
          ? Boolean(searchParams.is_male)
          : "",
      is_beneficiary:
        searchParams?.is_beneficiary !== undefined &&
        searchParams.is_beneficiary !== null
          ? Boolean(searchParams.is_beneficiary)
          : "",
      page: pagination?.current_page ?? 1,
      sort_by: searchParams?.sort_by ?? "",
      sort_direction: searchParams?.sort_direction ?? "",
    }),
    [searchParams, pagination]
  );

  const { data, setData, get, processing, errors } = useForm(initialParams);

  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<any>(null);

  useEffect(() => {
    setData(initialParams);
  }, [searchParams, pagination, initialParams, setData]);

  const submitSearch = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();

      const cleanedData = { ...data };
      for (const key in cleanedData) {
        // إذا كانت مصفوفة فارغة، حولها إلى null
        if (Array.isArray(cleanedData[key]) && cleanedData[key].length === 0) {
          cleanedData[key] = null;
        }
      }

      get(route("people.search.results"), {
        data: {
          ...cleanedData,
          page: 1, // عند كل بحث جديد، ابدأ من الصفحة الأولى
        },
        preserveScroll: true,
        onSuccess: () => {
          toast.success("تم تحديث نتائج البحث.");
        },
        onError: (err) => {
          toast.error("حدث خطأ في البحث. تأكد من صحة المدخلات.");
          console.error(err);
        },
      });
    },
    [data, get]
  );

  const handleReset = useCallback(() => {
    // قم بإعادة تعيين `data` إلى حالة فارغة تمامًا
    setData({
      search_name: "",
      card_type_id: [], // فارغة للمتعدد
      housing_type_id: [],
      center_id: [],
      social_state_id: [],
      level_state_id: [],
      is_male: "",
      is_beneficiary: "",
      page: 1,
      sort_by: "",
      sort_direction: "",
    });

    // ثم قم بإرسال طلب `get` ببيانات فارغة
    get(route("people.search.results"), {
      data: {
        search_name: null,
        card_type_id: null, // نُرسلها كـ null للخادم
        housing_type_id: null,
        center_id: null,
        social_state_id: null,
        level_state_id: null,
        is_male: null,
        is_beneficiary: null,
        page: 1,
        sort_by: null,
        sort_direction: null,
      },
      preserveScroll: true,
      onSuccess: () => {
        toast.success("تم إعادة تعيين البحث بنجاح.");
      },
      onError: (err) => {
        toast.error("حدث خطأ عند إعادة تعيين البحث.");
        console.error(err);
      },
    });
  }, [setData, get]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const cleanedData = { ...data };
      for (const key in cleanedData) {
        if (Array.isArray(cleanedData[key]) && cleanedData[key].length === 0) {
          cleanedData[key] = null;
        }
      }

      setData("page", newPage);
      get(route("people.search.results"), {
        data: { ...cleanedData, page: newPage },
        preserveScroll: true,
      });
    },
    [data, setData, get]
  );

  const columnDefs = useMemo(() => {
    const baseCols = [
      {
        headerName: "#",
        valueGetter:
          "node.rowIndex + 1 + " +
          (pagination?.current_page - 1) * (pagination?.per_page || 0),
        width: 60,
      },
      { headerName: "الاسم", field: "name", filter: false, sortable: true },
      {
        headerName: "ذكر / انثى",
        field: "is_male",
        valueFormatter: (params) => (params.value ? "ذكر" : "انثى"),
        filter: false,
        sortable: true,
      },
      {
        headerName: "تاريخ الميلاد",
        field: "birth_date",
        filter: false,
        sortable: true,
      },
      {
        headerName: "مستفيد/غير مستفيد",
        field: "is_beneficiary",
        valueFormatter: (params) => (params.value ? "مستفيد" : "غير مستفيد"),
        filter: false,
        sortable: true,
      },
      {
        headerName: "الحارة ",
        field: "center.name",
        filter: false,
        sortable: true,
      },
      {
        headerName: "عنوان السكن",
        field: "housing_address",
        filter: false,
        sortable: true,
      },
      {
        headerName: "الهاتف",
        field: "phone_number",
        filter: false,
        sortable: true,
      },
      {
        headerName: "نوع السكن",
        field: "housing_type.name",
        filter: false,
        sortable: true,
      },
      {
        headerName: "نوع البطاقة",
        field: "card_type.name",
        filter: false,
        sortable: true,
      },
      {
        headerName: "رقم البطاقة",
        field: "card_number",
        filter: false,
        sortable: true,
      },
      { headerName: "المهنة", field: "job", filter: false, sortable: true },
      {
        headerName: "الحالة الاجتماعية",
        field: "social_state.name",
        filter: false,
        sortable: true,
      },
      {
        headerName: "مستوى الحالة",
        field: "level_state.name",
        filter: false,
        sortable: true,
      },
      {
        headerName: "عدد الحالات",
        field: "meal_count",
        filter: false,
        sortable: true,
      },
      {
        headerName: "عدد الذكور",
        field: "male_count",
        filter: false,
        sortable: true,
      },
      {
        headerName: "عدد الإناث",
        field: "female_count",
        filter: false,
        sortable: true,
      },
      {
        headerName: "أفراد الأسرة",
        field: "family_members_count",
        valueGetter: (params) => {
          const count = params.data?.family_members_count;
          return count > 0 ? `${count} أفراد` : "لا يوجد";
        },
        filter: false,
        sortable: true,
      },
      { headerName: "ملاحظات", field: "notes", filter: false, sortable: true },
      {
        headerName: "الإجراءات",
        width: 150,
        cellRenderer: ActionsCellRenderer,
        resizable: false,
        sortable: false,
        filter: false,
      },
    ];

    return baseCols.map((col) => ({
      ...col,
      onSortChanged: (e) => {
        const sortModel = gridRef.current?.api?.getSortModel();
        if (sortModel && sortModel.length > 0) {
          setData({
            ...data,
            sort_by: sortModel[0].colId,
            sort_direction: sortModel[0].sort,
            page: 1,
          });
          submitSearch();
        } else if (data.sort_by) {
          setData({
            ...data,
            sort_by: "",
            sort_direction: "",
            page: 1,
          });
          submitSearch();
        }
      },
    }));
  }, [data, setData, submitSearch, pagination]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      filter: false,
      sortable: true,
      resizable: true,
      suppressHeaderMenuButton: true,
    };
  }, []);

  const onGridReady = useCallback(
    (params: any) => {
      setGridApi(params.api);
      if (data.sort_by && data.sort_direction) {
        params.api.setSortModel([
          { colId: data.sort_by, sort: data.sort_direction },
        ]);
      }
    },
    [data.sort_by, data.sort_direction]
  );

  return (
    <AppLayout breadcrumbs={[{ title: "بحث الأشخاص", href: "/people/search" }]}>
      <Head title="بحث الأشخاص" />

      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button onClick={() => router.get(route("people.create"))}>
              إضافة شخص جديد
            </Button>
            <Button
              variant="secondary"
              onClick={handleReset}
              disabled={processing}
            >
              إعادة تعيين البحث
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.get(route("people.search.form"))}
            >
              العودة لقائمة الكل
            </Button>
          </div>
        </div>

        <form
          onSubmit={submitSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded shadow-sm bg-white dark:bg-gray-800"
        >
          <div>
            <Label htmlFor="search_name">الاسم:</Label>
            <Input
              id="search_name"
              type="text"
              value={data.search_name}
              onChange={(e) => setData("search_name", e.target.value)}
              className="mt-1"
            />
          </div>

          {/* استخدام <select multiple> لكل حقل */}
          {/* Card Type */}
          <div>
            <Label htmlFor="card_type_id">نوع البطاقة:</Label>
            <select
              multiple
              id="card_type_id" // مهم للـ Label
              value={data.card_type_id.map(String)} // value يجب أن تكون مصفوفة من Strings
              onChange={(e) =>
                setData(
                  "card_type_id",
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
              className="w-full border rounded p-2" // يمكنك إضافة كلاسات TailwindCSS
          
            >
                {/* خيار "الكل" ليس ضروريًا هنا لأنه يمكنك ببساطة عدم تحديد أي شيء */}
                {cardTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.name}
                    </option>
                ))}
            </select>
          </div>

          {/* Housing Type */}
          <div>
            <Label htmlFor="housing_type_id">نوع السكن:</Label>
            <select
              multiple
              id="housing_type_id"
              value={data.housing_type_id.map(String)}
              onChange={(e) =>
                setData(
                  "housing_type_id",
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
                    className="w-full border rounded p-2"
            >
                {housingTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.name}
                    </option>
                ))}
            </select>
          </div>

          {/* Center */}
          <div>
            <Label htmlFor="center_id">الحارة:</Label>
            <select
              multiple
              id="center_id"
              value={data.center_id.map(String)}
              onChange={(e) =>
                setData(
                  "center_id",
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
                    className="w-full border rounded p-2"
            >
                {centers.map((center) => (
                    <option key={center.id} value={center.id}>
                        {center.name}
                    </option>
                ))}
            </select>
          </div>

          {/* Social State */}
          <div>
            <Label htmlFor="social_state_id">الحالة الاجتماعية:</Label>
            <select
              multiple
              id="social_state_id"
              value={data.social_state_id.map(String)}
              onChange={(e) =>
                setData(
                  "social_state_id",
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
              className="w-full border rounded p-2"
                      >
                {socialStates.map((state) => (
                    <option key={state.id} value={state.id}>
                        {state.name}
                    </option>
                ))}
            </select>
          </div>

          {/* Level State */}
          <div>
            <Label htmlFor="level_state_id">مستوى الحالة:</Label>
            <select
              multiple
              id="level_state_id"
              value={data.level_state_id.map(String)}
              onChange={(e) =>
                setData(
                  "level_state_id",
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
              className="w-full border rounded p-2"
                >
                {levelStates.map((state) => (
                    <option key={state.id} value={state.id}>
                        {state.name}
                    </option>
                ))}
            </select>
          </div>

          {/* Checkboxes (لا تغيير) */}
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="is_male"
              checked={data.is_male === true}
              onCheckedChange={(checked) => setData("is_male", checked)}
            />
            <Label htmlFor="is_male">ذكر</Label>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id="is_beneficiary"
              checked={data.is_beneficiary === true}
              onCheckedChange={(checked) => setData("is_beneficiary", checked)}
            />
            <Label htmlFor="is_beneficiary">مستفيد</Label>
          </div>

          <div className="md:col-span-4 text-right">
            <Button type="submit" disabled={processing}>
              بحث
            </Button>
          </div>
        </form>

        {processing && (
          <div className="text-center p-4">جاري تحميل البيانات...</div>
        )}

        {people.length > 0 ? (
          <>
            <div
              className="ag-theme-quartz"
              style={{ height: "500px", width: "100%" }}
            >
              <ThemedAgGrid
                ref={gridRef}
                rowData={people}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                domLayout="normal"
                animateRows={true}
                enableRtl={true}
              />
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center p-10">
            {processing
              ? "جاري تحميل البيانات..."
              : "لا توجد نتائج مطابقة لمعايير البحث."}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

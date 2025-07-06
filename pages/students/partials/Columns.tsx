import StudentActions from "./StudentActions";

export const getStudentColumns = (): ColDef[] => [
  {
    headerName: "م",
    valueGetter: (params: any) => params.node.rowIndex + 1,
    width: 50,
  },
  { headerName: "الاسم", field: "name", sortable: true, filter: true, flex: 1, minWidth: 150 },
  { headerName: "المركز", field: "center.name", sortable: true, filter: true, flex: 1, minWidth: 80 ,suppressHeaderMenuButton: true },
  { headerName: "المستوى", field: "level.name", sortable: true, filter: true, flex: 1, minWidth: 120 ,suppressHeaderMenuButton: true },
  { headerName: "تاريخ الميلاد", field: "birth_date", filter: true, sortable: true, width: 120  ,suppressHeaderMenuButton: true},
  { headerName: "العنوان", field: "address", flex: 2, minWidth: 100  ,suppressHeaderMenuButton: true},
  { headerName: "رقم الهاتف", field: "phone", width: 120 ,suppressHeaderMenuButton: true },
  { headerName: "الملاحظات", field: "notes", flex: 2, minWidth: 150  ,suppressHeaderMenuButton: true},
    {
      headerName: "الخيارات",
      field: "id",
      width: 120,
       suppressHeaderMenuButton: true,
      cellRenderer: (params: { value: number }) => (
        <StudentActions studentId={params.value} />
      ),
    },
];

import NameCellRenderer from './NameCellRenderer';

export const createColumnDefinitions = () => ({
    id :  {
        headerName: 'ID', field: 'id', minWidth: 65, width: 70,
        pinned: 'right'
    },
  name:{
  headerName: 'الاسم',
  field: 'name',
  minWidth: 180,
  sortable: true,
  filter: true,
  cellRenderer: NameCellRenderer,
}, 
  birth_date: { headerName: 'تاريخ الميلاد', field: 'birth_date' },
  phone_number: { headerName: 'رقم الهاتف', field: 'phone_number' },
  job: { headerName: 'المهنة', field: 'job' },
  'card_type.name': { headerName: 'نوع البطاقة', field: 'card_type.name' },
  'housing_type.name': { headerName: 'نوع السكن', field: 'housing_type.name' },
  'location.name': { headerName: 'الحارة', field: 'location.name' },
  is_male: {
    headerName: 'الجنس',
    field: 'is_male',
    valueFormatter: (p: any) => (p.value ? 'ذكر' : 'أنثى')
  },
  is_beneficiary: {
    headerName: 'مستفيد؟',
    field: 'is_beneficiary',
    valueFormatter: (p: any) => (p.value ? 'مستفيد' : 'غير مستفيد')
  },
  card_number: { headerName: 'رقم البطاقة', field: 'card_number' },
  housing_address: { headerName: 'عنوان السكن', field: 'housing_address' },
  'social_state.name': { headerName: 'الحالة الاجتماعية', field: 'social_state.name' },
  'level_state.name': { headerName: 'مستوى الحالة', field: 'level_state.name' },
  meal_count: { headerName: 'عدد الحالات', field: 'meal_count' },
  male_count: { headerName: 'عدد الذكور', field: 'male_count' },
  female_count: { headerName: 'عدد الإناث', field: 'female_count' },
  family_members: {
    headerName: 'عدد أفراد الأسرة',
    field: 'family_members',
    valueGetter: (p: any) => {
      const count = p.data.family_members?.length || 0;
      return count > 0 ? `${count} أفراد` : 'لا يوجد';
    }
  },
  notes: { headerName: 'ملاحظات', field: 'notes' },
});
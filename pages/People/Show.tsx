import React,{ useEffect} from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PersonShow() {
  const { person, flash } = usePage().props as {
    person: any;
    flash?: { success?: string };
  };
  
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
  }, [flash]);
  
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

const handleDelete = () => {
  router.delete(route('people.destroy', person.id), {
    onSuccess: () => {
      toast.success(`تم حذف ${person.name} بنجاح`);
    },
    onError: () => {
        console.error("خطأ في الحذف:", error);
      toast.error('فشل الحذف');
    },
  });
};


  return (
    <AppLayout breadcrumbs={[
      { title: 'قائمة الأشخاص', href: '/people/report' },
      { title: person.name }
    ]}>
      <Head title={`بيانات ${person.name}`} />
   <div className="flex gap-2 my-4">
  <Button onClick={() => router.get(route('people.edit', person.id))}>
    ✏️ تعديل
  </Button>
  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
    🗑️ حذف
  </Button>
</div>   
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">بيانات الشخص: {person.name}</h1>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>الاسم:</strong> {person.name}</div>
          <div><strong>الجنس:</strong> {person.is_male ? 'ذكر' : 'أنثى'}</div>
          <div><strong>تاريخ الميلاد:</strong> {person.birth_date}</div>
          <div><strong>الهاتف:</strong> {person.phone_number}</div>
          <div><strong>نوع البطاقة:</strong> {person.card_type?.name ?? '—'}</div>
          <div><strong>رقم البطاقة:</strong> {person.card_number}</div>
          <div><strong>نوع السكن:</strong> {person.housing_type?.name ?? '—'}</div>
          <div><strong>عنوان السكن:</strong> {person.housing_address}</div>
          <div><strong>الحارة:</strong> {person.location?.name ?? '—'}</div>
          <div><strong>الحالة الاجتماعية:</strong> {person.social_state?.name ?? '—'}</div>
          <div><strong>مستوى الحالة:</strong> {person.level_state?.name ?? '—'}</div>
          <div><strong>مستفيد؟</strong> {person.is_beneficiary ? 'نعم' : 'لا'}</div>
          <div><strong>عدد الحالات:</strong> {person.meal_count}</div>
          <div><strong>عدد الذكور:</strong> {person.male_count}</div>
          <div><strong>عدد الإناث:</strong> {person.female_count}</div>
          <div><strong>عدد أفراد الأسرة:</strong> {person.family_members.length}</div>
          <div><strong>ملاحظات:</strong> {person.notes ?? '—'}</div>
        </div>
{person.family_members.length > 0 && (
  <div className="mt-8">
    <h2 className="text-lg font-semibold mb-2">👨‍👩‍👧‍👦 أفراد الأسرة ({person.family_members.length})</h2>
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border px-2 py-1">الاسم</th>
          <th className="border px-2 py-1">العمر</th>
          <th className="border px-2 py-1">الجنس</th>
          <th className="border px-2 py-1">صلة القرابة</th>
        </tr>
      </thead>
      <tbody>
        {person.family_members.map((member: any) => (
          <tr key={member.id}>
            <td className="border px-2 py-1">{member.name}</td>
            <td className="border px-2 py-1">{member.birth_date ?? '—'}</td>
            <td className="border px-2 py-1">{member.is_male ? 'ذكر' : 'أنثى'}</td>
            <td className="border px-2 py-1">{member.relationship ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
       <div className="mt-4">
          <Link href="/people/report" className="text-blue-600 hover:underline">⬅️ العودة إلى القائمة</Link>
        </div>
      </div>
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>تأكيد الحذف</DialogTitle>
    </DialogHeader>
    <p>هل أنت متأكد أنك تريد حذف {person.name}؟ هذا الإجراء لا يمكن التراجع عنه.</p>
    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>إلغاء</Button>
      <Button variant="destructive" onClick={handleDelete}>تأكيد الحذف</Button>
    </div>
  </DialogContent>
</Dialog>

    </AppLayout>
    
    
  );
}

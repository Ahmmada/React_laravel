import React, { useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { toast } from 'sonner';
import { 
  User, 
  Phone, 
  MapPin, 
  Home, 
  CreditCard, 
  Users, 
  FileText, 
  Calendar,
  Edit,
  Trash2,
  ArrowLeft,
  UserCheck,
  Heart,
  Briefcase
} from 'lucide-react';

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
  card_type: { name: string } | null;
  card_number: string | null;
  phone_number: string | null;
  job: string | null;
  housing_type: { name: string } | null;
  housing_address: string | null;
  location: { name: string } | null;
  social_state: { name: string } | null;
  level_state: { name: string } | null;
  meal_count: number;
  male_count: number;
  female_count: number;
  notes: string | null;
  family_members: FamilyMember[];
}

interface PageProps {
  person: PersonData;
  flash?: { success?: string };
}

// دالة حساب العمر
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// مكون لعرض معلومة واحدة
const InfoItem = ({ 
  icon: Icon, 
  label, 
  value, 
  className = "" 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string | number | null; 
  className?: string;
}) => (
  <div className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 ${className}`}>
    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
      <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
        {value || '—'}
      </p>
    </div>
  </div>
);

export default function PersonShow() {
  const { person, flash } = usePage<PageProps>().props;
  
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
      onError: (error) => {
        console.error("خطأ في الحذف:", error);
        toast.error('فشل الحذف');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'قائمة الأشخاص', href: '/people/report' },
      { title: person.name, href: `/people/${person.id}` }
    ]}>
      <Head title={`بيانات ${person.name}`} />
      
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {person.name}
              </h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant={person.is_male ? "default" : "secondary"}>
                  {person.is_male ? 'ذكر' : 'أنثى'}
                </Badge>
                <Badge variant={person.is_beneficiary ? "default" : "outline"}>
                  {person.is_beneficiary ? 'مستفيد' : 'غير مستفيد'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => router.get(route('people.edit', person.id))}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              تعديل
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              حذف
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.get('/people/report')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* المعلومات الأساسية */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem 
                  icon={Calendar} 
                  label="تاريخ الميلاد" 
                  value={person.birth_date} 
                />
                <InfoItem 
                  icon={Phone} 
                  label="رقم الهاتف" 
                  value={person.phone_number} 
                />
                <InfoItem 
                  icon={Briefcase} 
                  label="المهنة" 
                  value={person.job} 
                />
                <InfoItem 
                  icon={Heart} 
                  label="الحالة الاجتماعية" 
                  value={person.social_state?.name} 
                />
              </div>
            </CardContent>
          </Card>

          {/* الإحصائيات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                الإحصائيات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InfoItem 
                  icon={Users} 
                  label="عدد الحالات" 
                  value={person.meal_count} 
                />
                <InfoItem 
                  icon={Users} 
                  label="عدد الذكور" 
                  value={person.male_count} 
                />
                <InfoItem 
                  icon={Users} 
                  label="عدد الإناث" 
                  value={person.female_count} 
                />
                <InfoItem 
                  icon={Users} 
                  label="أفراد الأسرة" 
                  value={person.family_members.length} 
                />
              </div>
            </CardContent>
          </Card>

          {/* معلومات البطاقة */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                معلومات البطاقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InfoItem 
                  icon={CreditCard} 
                  label="نوع البطاقة" 
                  value={person.card_type?.name} 
                />
                <InfoItem 
                  icon={CreditCard} 
                  label="رقم البطاقة" 
                  value={person.card_number} 
                />
              </div>
            </CardContent>
          </Card>

          {/* معلومات السكن */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                معلومات السكن
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <InfoItem 
                  icon={Home} 
                  label="نوع السكن" 
                  value={person.housing_type?.name} 
                />
                <InfoItem 
                  icon={MapPin} 
                  label="الحارة" 
                  value={person.location?.name} 
                />
                <InfoItem 
                  icon={MapPin} 
                  label="عنوان السكن" 
                  value={person.housing_address} 
                />
              </div>
            </CardContent>
          </Card>

          {/* معلومات إضافية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                معلومات إضافية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoItem 
                icon={UserCheck} 
                label="مستوى الحالة" 
                value={person.level_state?.name} 
              />
            </CardContent>
          </Card>
        </div>

        {/* أفراد الأسرة */}
        {person.family_members.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                أفراد الأسرة ({person.family_members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {person.family_members.map((member, index) => (
                    <div 
                      key={member.id} 
                      className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          فرد الأسرة #{index + 1}
                        </span>
                        <Badge variant={member.is_male ? "default" : "secondary"}>
                          {member.is_male ? 'ذكر' : 'أنثى'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">العمر:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {member.birth_date ? `${calculateAge(member.birth_date)} سنة` : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">تاريخ الميلاد:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {member.birth_date || '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* الملاحظات */}
        {person.notes && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                الملاحظات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {person.notes}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog تأكيد الحذف */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد الحذف</DialogTitle>
            <DialogDescription>
              هل أنت متأكد أنك تريد حذف {person.name}؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
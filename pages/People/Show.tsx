import React, { useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Briefcase,
  Printer
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

// مكون مدمج لعرض معلومة واحدة
const CompactInfoItem = ({ 
  label, 
  value, 
  className = "" 
}: { 
  label: string; 
  value: string | number | null; 
  className?: string;
}) => (
  <div className={`flex justify-between items-center py-1 border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${className}`}>
    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
      {label}:
    </span>
    <span className="text-xs text-gray-900 dark:text-gray-100 text-right ml-2 break-words">
      {value || '—'}
    </span>
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppLayout breadcrumbs={[
      { title: 'قائمة الأشخاص', href: '/people/report' },
      { title: person.name, href: `/people/${person.id}` }
    ]}>
      <Head title={`بيانات ${person.name}`} />
      
      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .print-container { 
            max-width: none !important; 
            margin: 0 !important; 
            padding: 10px !important;
            font-size: 11px !important;
          }
          .print-card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            margin-bottom: 8px !important;
            page-break-inside: avoid;
          }
          .print-header {
            font-size: 16px !important;
            margin-bottom: 10px !important;
          }
          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .print-family-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
          }
        }
      `}</style>
      
      <div className="print-container container mx-auto py-4 px-2 max-w-4xl">
        {/* Header Section - مدمج */}
        <div className="no-print flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {person.name}
              </h1>
              <div className="flex gap-1 mt-1">
                <Badge variant={person.is_male ? "default" : "secondary"} className="text-xs px-2 py-0">
                  {person.is_male ? 'ذكر' : 'أنثى'}
                </Badge>
                <Badge variant={person.is_beneficiary ? "default" : "outline"} className="text-xs px-2 py-0">
                  {person.is_beneficiary ? 'مستفيد' : 'غير مستفيد'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button 
              size="sm"
              onClick={handlePrint}
              className="flex items-center gap-1 text-xs"
            >
              <Printer className="w-3 h-3" />
              طباعة
            </Button>
            <Button 
              size="sm"
              onClick={() => router.get(route('people.edit', person.id))}
              className="flex items-center gap-1 text-xs"
            >
              <Edit className="w-3 h-3" />
              تعديل
            </Button>
            <Button 
              size="sm"
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-1 text-xs"
            >
              <Trash2 className="w-3 h-3" />
              حذف
            </Button>
            <Button 
              size="sm"
              variant="outline" 
              onClick={() => router.get('/people/report')}
              className="flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              عودة
            </Button>
          </div>
        </div>

        {/* Print Header */}
        <div className="print-header hidden print:block text-center border-b-2 border-gray-300 pb-2 mb-4">
          <h1 className="font-bold">بيانات الشخص: {person.name}</h1>
          <div className="text-sm mt-1">
            {person.is_male ? 'ذكر' : 'أنثى'} • {person.is_beneficiary ? 'مستفيد' : 'غير مستفيد'}
          </div>
        </div>

        {/* Main Content Grid - مدمج جداً */}
        <div className="print-grid grid grid-cols-1 lg:grid-cols-2 gap-3">
          
          {/* المعلومات الأساسية */}
          <Card className="print-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1 text-sm">
                <User className="w-4 h-4" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-0">
              <CompactInfoItem label="تاريخ الميلاد" value={person.birth_date} />
              <CompactInfoItem 
                label="العمر" 
                value={person.birth_date ? `${calculateAge(person.birth_date)} سنة` : null} 
              />
              <CompactInfoItem label="رقم الهاتف" value={person.phone_number} />
              <CompactInfoItem label="المهنة" value={person.job} />
              <CompactInfoItem label="الحالة الاجتماعية" value={person.social_state?.name} />
              <CompactInfoItem label="مستوى الحالة" value={person.level_state?.name} />
            </CardContent>
          </Card>

          {/* معلومات البطاقة والسكن */}
          <Card className="print-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1 text-sm">
                <CreditCard className="w-4 h-4" />
                البطاقة والسكن
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-0">
              <CompactInfoItem label="نوع البطاقة" value={person.card_type?.name} />
              <CompactInfoItem label="رقم البطاقة" value={person.card_number} />
              <CompactInfoItem label="نوع السكن" value={person.housing_type?.name} />
              <CompactInfoItem label="الحارة" value={person.location?.name} />
              <CompactInfoItem label="عنوان السكن" value={person.housing_address} />
            </CardContent>
          </Card>

          {/* الإحصائيات */}
          <Card className="print-card">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4" />
                الإحصائيات العائلية
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-0">
              <CompactInfoItem label="عدد الحالات" value={person.meal_count} />
              <CompactInfoItem label="عدد الذكور" value={person.male_count} />
              <CompactInfoItem label="عدد الإناث" value={person.female_count} />
              <CompactInfoItem label="أفراد الأسرة" value={person.family_members.length} />
            </CardContent>
          </Card>

          {/* الملاحظات */}
          {person.notes && (
            <Card className="print-card">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-1 text-sm">
                  <FileText className="w-4 h-4" />
                  الملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-gray-900 dark:text-gray-100 whitespace-pre-wrap bg-gray-50 dark:bg-gray-800/50 p-2 rounded">
                  {person.notes}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* أفراد الأسرة - مدمج */}
        {person.family_members.length > 0 && (
          <Card className="print-card mt-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-1 text-sm">
                <Users className="w-4 h-4" />
                أفراد الأسرة ({person.family_members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="print-family-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {person.family_members.map((member, index) => (
                  <div 
                    key={member.id} 
                    className="p-2 border rounded bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                        فرد #{index + 1}
                      </span>
                      <Badge variant={member.is_male ? "default" : "secondary"} className="text-xs px-1 py-0">
                        {member.is_male ? 'ذ' : 'أ'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">العمر:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {member.birth_date ? `${calculateAge(member.birth_date)} سنة` : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">الميلاد:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {member.birth_date || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
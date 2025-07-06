import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types'; // استيراد SharedData
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Settings2, Settings, SquareTerminal, Map, Bot, Trash2 } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    // الوصول إلى props المشتركة وتحديد النوع
    const { auth } = usePage().props as SharedData;

    // دالة للتحقق مما إذا كان المستخدم يملك صلاحية معينة
    const can = (permission: string) => {
        return auth.can.includes(permission);
    };

    const mainNavItems: NavItem[] = [
        {
            title: 'لوحة التحكم',
            href: '/dashboard',
            icon: LayoutGrid,
        },
                {
            title: 'بيانات المبادرة',
            href: '/people/report',
            icon: BookOpen,
     }, 
        {
            title: 'الطلاب',
            href: '/students',
            icon: BookOpen,
            
            // مثال: أضف مفتاح can هنا

    //        can: 'عرض الطلاب', 

        },
        
                {
            title: 'المدرسين',
            href: '/teachers',
            icon: BookOpen,
     },       
        {
            title: 'سجلات الحضور - الطلاب',
            href: '/attendances',
            icon: Folder,
        },
        {
            title: 'سجلات الحضور - المدرسين',
            href: '/teacher_attendance',
            icon: Folder,

        },
  
    ];

    // تحديد عناصر الإعدادات بشكل منفصل لإنشاء قائمة فرعية ديناميكية
    const settingsSubItems: NavItem[] = [];

    // منطق بناء قائمة الإعدادات الفرعية
    if (can('ادوار المستخدمين')) {
        settingsSubItems.push(
            {
                title: 'المستخدمين',
                href: '/users',
                icon: Folder,
            },
            {
                title: 'الأدوار',
                href: '/roles',
                icon: Bot,
            },
            {
                title: 'الأذونات',
                href: '/permissions',
                icon: Settings2,
            },
            {
                title: 'المراكز',
                href: '/centers',
                icon: Map,
            },
            {
                title: 'المستويات',
                href: '/levels',
                icon: SquareTerminal,
            },
            {
                title: 'المجموعات - المدرسين',
                href: '/groups',
                icon: Folder,
            },
            {
                title: 'الحارات المستهدفة',
                href: '/locations',
                icon: Map,
            },
        );
    } else if (can('شاشة المستخدمين')) {
        // إذا كان يملك فقط صلاحية "شاشة المستخدمين"
        settingsSubItems.push(
            {
                title: 'المستخدمين',
                href: '/users',
                icon: Folder,
            },
            {
                title: 'المراكز',
                href: '/centers',
                icon: Map,
            },
            {
                title: 'المستويات',
                href: '/levels',
                icon: SquareTerminal,
            },
            {
                title: 'المجموعات - المدرسين',
                href: '/groups',
                icon: Folder,
            },
            {
                title: 'الحارات المستهدفة',
                href: '/locations',
                icon: Map,
            },
        );
    }

    // سجل العمليات يمكن أن يكون صلاحية منفصلة تُضاف بغض النظر عن ما سبق
    if (can('سجل العمليات')) {
        settingsSubItems.push(
            {
                title: 'سجل العمليات',
                href: '/activity-logs',
                icon: Trash2,
            }
        );
    }

    // بناء قائمة التنقل الرئيسية المفلترة بناءً على الصلاحيات
    const filteredMainNavItems: NavItem[] = mainNavItems.filter(item => {
        if (item.can) {
            return can(item.can);
        }
        return true; // إذا لم يكن هناك مفتاح 'can'، فاجعله مرئيًا افتراضياً
    });

    // إضافة عنصر الإعدادات كقائمة فرعية إذا كان هناك أي عناصر فرعية مرئية
    if (settingsSubItems.length > 0) {
        filteredMainNavItems.push({
            title: 'الإعدادات',
            href: '#', // يمكن أن يكون # أو مسار لصفحة إعدادات عامة
            icon: Settings, // أيقونة الإعدادات الرئيسية
            children: settingsSubItems, // استخدام children لإنشاء قائمة فرعية
        });
    }

    const footerNavItems: NavItem[] = [

    ];

    return (
        <Sidebar collapsible="icon" variant="inset" side="right" >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* تمرير القائمة المفلترة إلى NavMain */}
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

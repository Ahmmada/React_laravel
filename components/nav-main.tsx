import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    // حالة لفتح/إغلاق القوائم الفرعية. نستخدم href كـ ID فريد.
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const handleToggleSubmenu = (href: string) => {
        // إذا كانت القائمة الفرعية المفتوحة حاليًا هي نفسها التي تم النقر عليها، أغلقها.
        // وإلا، افتح القائمة الجديدة.
        setOpenSubmenu(openSubmenu === href ? null : href);
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.children && item.children.length > 0 ? (
                            // إذا كان العنصر يحتوي على عناصر فرعية
                            <>
                                {/* زر القائمة الرئيسية الذي يفتح/يغلق القائمة الفرعية */}
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        // النشاط يعتمد على مسار العنصر الرئيسي أو أي من عناصره الفرعية
                                        item.href === page.url ||
                                        item.children.some(subItem => subItem.href === page.url)
                                    }
                                    onClick={() => handleToggleSubmenu(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    {/* هنا نستخدم div بدلاً من Link لأن النقر على هذا الزر يفتح القائمة الفرعية وليس ينقل للصفحة */}
                                    {/* يمكنك إضافة سهم دوار (rotate arrow) هنا للإشارة إلى حالة الفتح/الإغلاق */}
                                    <div>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </div>
                                </SidebarMenuButton>

                                {/* القائمة الفرعية نفسها */}
                                <ul
                                    // استخدم `className` لتبديل العرض بناءً على `openSubmenu`
                                    className={`${openSubmenu === item.href ? 'block' : 'hidden'} pr-4 mt-2 space-y-1`}
                                >
                                    {item.children.map((subItem) => (
                                        <li key={subItem.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={subItem.href === page.url}
                                                tooltip={{ children: subItem.title }}
                                            >
                                                <Link href={subItem.href} prefetch>
                                                    {subItem.icon && <subItem.icon className="w-4 h-4 ml-1" />}
                                                    <span>{subItem.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            // إذا لم يكن العنصر يحتوي على عناصر فرعية، اعرضه كزر عادي
                            <SidebarMenuButton
                                asChild
                                isActive={item.href === page.url}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

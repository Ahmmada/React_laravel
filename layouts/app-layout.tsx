import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { DirectionProvider } from '@radix-ui/react-direction';
import { Toaster } from "sonner";


interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <DirectionProvider dir="rtl">
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>

            {children}
                    <Toaster position="top-right" richColors />

        </AppLayoutTemplate>
    </DirectionProvider>
);
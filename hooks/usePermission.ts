// src/hooks/usePermission.ts
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types'; // تأكد من استيراد SharedData الصحيحة

/**
 * Custom hook to check if the current user has a specific permission.
 *
 * @param permission The name of the permission to check.
 * @returns boolean True if the user has the permission, false otherwise.
 */
export default function usePermission(permission: string): boolean {
    const { auth } = usePage().props as SharedData;

    // تأكد أن auth.can موجودة وأنها مصفوفة قبل استخدام includes
    if (!auth || !auth.can || !Array.isArray(auth.can)) {
        return false;
    }

    return auth.can.includes(permission);
}

import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";


export default function SelectColumns() {
  const { allColumns } = usePage().props;
  const [selected, setSelected] = useState(() => allColumns.map(col => col.field));

  const toggleColumn = (field) => {
    setSelected((prev) =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleSubmit = () => {
    // احفظ الأعمدة في التخزين المحلي أو أرسلها للسيرفر
    localStorage.setItem('selectedColumns', JSON.stringify(selected));

    // توجيه المستخدم لصفحة عرض الأشخاص
    router.visit('/people');
  };

  return (
      

    <AppLayout breadcrumbs={[{ title: "عرض الاعمدة", href: "/columns" }]}>
      <Head title="قائمة الاعمدة" />
            <div className="container mx-auto py-8">
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">اختر الأعمدة التي تريد عرضها</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {allColumns.map((col) => (
          <label key={col.field} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selected.includes(col.field)}
              onChange={() => toggleColumn(col.field)}
            />
            <span>{col.label}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        حفظ ومتابعة
      </button>
    </div>
        </div>
    </AppLayout>
  );
}
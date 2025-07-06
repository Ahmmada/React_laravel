import React, { useRef, useEffect } from 'react'; // تأكد من استيراد useRef و useEffect

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  indeterminate?: boolean;
}

export function Checkbox({ checked, onCheckedChange, className = '', indeterminate = false }: CheckboxProps) {
  // 1. استخدم useRef لإنشاء مرجع لعنصر الـ input
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  // 2. استخدم useEffect لتعيين خاصية indeterminate مباشرة على عنصر DOM المرجع
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]); // اعتمد فقط على indeterminate لتشغيل هذا التأثير

  return (
    <input
      ref={inputRef} // 3. اربط الـ ref بعنصر الـ input
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${className}`}
    />
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (itemValue: string) => {
    setSelectedValue(itemValue);
    onValueChange?.(itemValue);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, {
              onClick: () => setIsOpen(!isOpen),
              selectedValue,
              isOpen
            });
          }
          if (child.type === SelectContent && isOpen) {
            return React.cloneElement(child, {
              onSelect: handleSelect,
              selectedValue
            });
          }
        }
        return null;
      })}
    </div>
  );
}

export function SelectTrigger({ className = '', children, onClick, selectedValue, isOpen }: SelectTriggerProps & any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
      <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
}

export function SelectContent({ children, onSelect, selectedValue }: SelectContentProps & any) {
  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, {
            onSelect,
            isSelected: child.props.value === selectedValue
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectItem({ value, children, onSelect, isSelected }: SelectItemProps & any) {
  return (
    <div
      onClick={() => onSelect(value)}
      className={`relative flex cursor-pointer select-none items-center py-2 px-3 text-sm outline-none hover:bg-gray-100 ${
        isSelected ? 'bg-blue-50 text-blue-600' : ''
      }`}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  return <span className="text-gray-500">{placeholder}</span>;
}
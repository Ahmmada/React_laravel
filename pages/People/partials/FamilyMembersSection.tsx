import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FamilyMember, FormErrors } from "./types";
import { Users, Plus, Trash2 } from "lucide-react";

interface FamilyMembersSectionProps {
    familyMembers: FamilyMember[];
    setFamilyMembers: (members: FamilyMember[]) => void;
    errors: FormErrors;
}

export default function FamilyMembersSection({
    familyMembers,
    setFamilyMembers,
    errors
}: FamilyMembersSectionProps) {
    const [nextId, setNextId] = useState(0);

    const addFamilyMember = () => {
        const newMember: FamilyMember = {
            id: nextId,
            birth_date: "",
            is_male: true,
        };
        setFamilyMembers([...familyMembers, newMember]);
        setNextId(nextId + 1);
    };

    const removeFamilyMember = (index: number) => {
        const updatedMembers = familyMembers.filter((_, i) => i !== index);
        setFamilyMembers(updatedMembers);
    };

    const updateFamilyMember = (index: number, field: keyof Omit<FamilyMember, 'id'>, value: string | boolean) => {
        const updatedMembers = familyMembers.map((member, i) =>
            i === index ? { ...member, [field]: value } : member
        );
        setFamilyMembers(updatedMembers);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        أفراد الأسرة التابعين ({familyMembers.length})
                    </CardTitle>
                    <Button
                        type="button"
                        onClick={addFamilyMember}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        إضافة فرد
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {familyMembers.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>لا يوجد أفراد أسرة مضافين</p>
                        <p className="text-sm">انقر على "إضافة فرد" لإضافة أفراد الأسرة</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {familyMembers.map((member, index) => (
                            <div
                                key={member.id || index}
                                className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-medium">فرد الأسرة #{index + 1}</h4>
                                    <Button
                                        type="button"
                                        onClick={() => removeFamilyMember(index)}
                                        variant="destructive"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        حذف
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor={`member-birth_date-${index}`}>
                                            تاريخ الميلاد
                                        </Label>
                                        <Input
                                            id={`member-birth_date-${index}`}
                                            type="date"
                                            value={member.birth_date}
                                            onChange={(e) =>
                                                updateFamilyMember(index, "birth_date", e.target.value)
                                            }
                                            className={
                                                errors[`family_members.${index}.birth_date`]
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {errors[`family_members.${index}.birth_date`] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors[`family_members.${index}.birth_date`]}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 space-x-reverse pt-6">
                                        <Checkbox
                                            id={`member-is_male-${index}`}
                                            checked={member.is_male}
                                            onCheckedChange={(checked) =>
                                                updateFamilyMember(index, "is_male", Boolean(checked))
                                            }
                                        />
                                        <Label htmlFor={`member-is_male-${index}`}>ذكر</Label>
                                        {errors[`family_members.${index}.is_male`] && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors[`family_members.${index}.is_male`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {errors.family_members && (
                    <p className="text-red-500 text-sm mt-4">{errors.family_members}</p>
                )}
            </CardContent>
        </Card>
    );
}
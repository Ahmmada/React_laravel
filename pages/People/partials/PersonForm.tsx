import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PersonFormData, Option, FamilyMember, FormErrors } from "./types";
import FamilyMembersSection from "./FamilyMembersSection";
import { User, Phone, MapPin, Home, CreditCard, Users, FileText } from "lucide-react";

interface PersonFormProps {
    data: PersonFormData;
    setData: (key: keyof PersonFormData, value: any) => void;
    errors: FormErrors;
    cardTypes: Option[];
    locations: Option[];
    housingTypes: Option[];
    socialStates: Option[];
    levelStates: Option[];
    isEdit?: boolean;
}

export default function PersonForm({
    data,
    setData,
    errors,
    cardTypes,
    locations,
    housingTypes,
    socialStates,
    levelStates,
    isEdit = false
}: PersonFormProps) {
    return (
        <div className="space-y-8">
            {/* المعلومات الأساسية */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        المعلومات الأساسية
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <Label htmlFor="name">الاسم الكامل *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="أدخل الاسم الكامل"
                                className={errors.name ? "border-red-500" : ""}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="birth_date">تاريخ الميلاد</Label>
                            <Input
                                id="birth_date"
                                type="date"
                                value={data.birth_date}
                                onChange={(e) => setData("birth_date", e.target.value)}
                                className={errors.birth_date ? "border-red-500" : ""}
                            />
                            {errors.birth_date && <p className="text-red-500 text-sm mt-1">{errors.birth_date}</p>}
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                                id="is_male"
                                checked={data.is_male}
                                onCheckedChange={(checked) => setData("is_male", Boolean(checked))}
                            />
                            <Label htmlFor="is_male">ذكر</Label>
                        </div>

                        <div className="flex items-center space-x-2 space-x-reverse">
                            <Checkbox
                                id="is_beneficiary"
                                checked={data.is_beneficiary}
                                onCheckedChange={(checked) => setData("is_beneficiary", Boolean(checked))}
                            />
                            <Label htmlFor="is_beneficiary">مستفيد</Label>
                        </div>

                        <div>
                            <Label htmlFor="social_state_id">الحالة الاجتماعية</Label>
                            <Select
                                value={data.social_state_id ? String(data.social_state_id) : ""}
                                onValueChange={(value) => setData("social_state_id", value === "" ? null : Number(value))}
                            >
                                <SelectTrigger id="social_state_id">
                                    <SelectValue placeholder="اختر الحالة الاجتماعية" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">غير محدد</SelectItem>
                                    {socialStates.map((state) => (
                                        <SelectItem key={state.id} value={String(state.id)}>
                                            {state.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.social_state_id && <p className="text-red-500 text-sm mt-1">{errors.social_state_id}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* معلومات الاتصال والعمل */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        معلومات الاتصال والعمل
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="phone_number">رقم الهاتف</Label>
                            <Input
                                id="phone_number"
                                type="tel"
                                value={data.phone_number}
                                onChange={(e) => setData("phone_number", e.target.value)}
                                placeholder="05xxxxxxxx"
                                className={errors.phone_number ? "border-red-500" : ""}
                            />
                            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                        </div>

                        <div>
                            <Label htmlFor="job">الوظيفة</Label>
                            <Input
                                id="job"
                                value={data.job}
                                onChange={(e) => setData("job", e.target.value)}
                                placeholder="أدخل الوظيفة"
                                className={errors.job ? "border-red-500" : ""}
                            />
                            {errors.job && <p className="text-red-500 text-sm mt-1">{errors.job}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* معلومات البطاقة والهوية */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        معلومات البطاقة والهوية
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="card_type_id">نوع البطاقة</Label>
                            <Select
                                value={data.card_type_id ? String(data.card_type_id) : ""}
                                onValueChange={(value) => setData("card_type_id", value === "" ? null : Number(value))}
                            >
                                <SelectTrigger id="card_type_id">
                                    <SelectValue placeholder="اختر نوع البطاقة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">غير محدد</SelectItem>
                                    {cardTypes.map((type) => (
                                        <SelectItem key={type.id} value={String(type.id)}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.card_type_id && <p className="text-red-500 text-sm mt-1">{errors.card_type_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="card_number">رقم البطاقة</Label>
                            <Input
                                id="card_number"
                                value={data.card_number}
                                onChange={(e) => setData("card_number", e.target.value)}
                                placeholder="أدخل رقم البطاقة"
                                className={errors.card_number ? "border-red-500" : ""}
                            />
                            {errors.card_number && <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* معلومات السكن والموقع */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Home className="w-5 h-5" />
                        معلومات السكن والموقع
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="housing_type_id">نوع السكن</Label>
                            <Select
                                value={data.housing_type_id ? String(data.housing_type_id) : ""}
                                onValueChange={(value) => setData("housing_type_id", value === "" ? null : Number(value))}
                            >
                                <SelectTrigger id="housing_type_id">
                                    <SelectValue placeholder="اختر نوع السكن" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">غير محدد</SelectItem>
                                    {housingTypes.map((type) => (
                                        <SelectItem key={type.id} value={String(type.id)}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.housing_type_id && <p className="text-red-500 text-sm mt-1">{errors.housing_type_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="location_id">الحارة</Label>
                            <Select
                                value={data.location_id ? String(data.location_id) : ""}
                                onValueChange={(value) => setData("location_id", value === "" ? null : Number(value))}
                            >
                                <SelectTrigger id="location_id">
                                    <SelectValue placeholder="اختر الحارة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">غير محدد</SelectItem>
                                    {locations.map((location) => (
                                        <SelectItem key={location.id} value={String(location.id)}>
                                            {location.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.location_id && <p className="text-red-500 text-sm mt-1">{errors.location_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="level_state_id">مستوى الحالة</Label>
                            <Select
                                value={data.level_state_id ? String(data.level_state_id) : ""}
                                onValueChange={(value) => setData("level_state_id", value === "" ? null : Number(value))}
                            >
                                <SelectTrigger id="level_state_id">
                                    <SelectValue placeholder="اختر مستوى الحالة" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">غير محدد</SelectItem>
                                    {levelStates.map((state) => (
                                        <SelectItem key={state.id} value={String(state.id)}>
                                            {state.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.level_state_id && <p className="text-red-500 text-sm mt-1">{errors.level_state_id}</p>}
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <Label htmlFor="housing_address">عنوان السكن</Label>
                            <Input
                                id="housing_address"
                                value={data.housing_address}
                                onChange={(e) => setData("housing_address", e.target.value)}
                                placeholder="أدخل عنوان السكن التفصيلي"
                                className={errors.housing_address ? "border-red-500" : ""}
                            />
                            {errors.housing_address && <p className="text-red-500 text-sm mt-1">{errors.housing_address}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* الإحصائيات العائلية */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        الإحصائيات العائلية
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <Label htmlFor="meal_count">عدد الحالات</Label>
                            <Input
                                id="meal_count"
                                type="number"
                                min="0"
                                value={data.meal_count}
                                onChange={(e) => setData("meal_count", Math.max(0, parseInt(e.target.value) || 0))}
                                className={errors.meal_count ? "border-red-500" : ""}
                            />
                            {errors.meal_count && <p className="text-red-500 text-sm mt-1">{errors.meal_count}</p>}
                        </div>

                        <div>
                            <Label htmlFor="male_count">عدد الذكور في الأسرة</Label>
                            <Input
                                id="male_count"
                                type="number"
                                min="0"
                                value={data.male_count}
                                onChange={(e) => setData("male_count", Math.max(0, parseInt(e.target.value) || 0))}
                                className={errors.male_count ? "border-red-500" : ""}
                            />
                            {errors.male_count && <p className="text-red-500 text-sm mt-1">{errors.male_count}</p>}
                        </div>

                        <div>
                            <Label htmlFor="female_count">عدد الإناث في الأسرة</Label>
                            <Input
                                id="female_count"
                                type="number"
                                min="0"
                                value={data.female_count}
                                onChange={(e) => setData("female_count", parseInt(e.target.value) || 0)}
                                className={errors.female_count ? "border-red-500" : ""}
                            />
                            {errors.female_count && <p className="text-red-500 text-sm mt-1">{errors.female_count}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* أفراد الأسرة */}
            <FamilyMembersSection
                familyMembers={data.family_members}
                setFamilyMembers={(members) => setData("family_members", members)}
                errors={errors}
            />

            {/* الملاحظات */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        الملاحظات
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <Label htmlFor="notes">ملاحظات إضافية</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            placeholder="أدخل أي ملاحظات إضافية..."
                            rows={4}
                            className={errors.notes ? "border-red-500" : ""}
                        />
                        {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
// resources/js/Pages/People/ReportSetup.tsx

import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from 'react';
import { ReportFilters, ReportPreset, ColumnDefinition, Location, SocialState, CardType, HousingType, LevelState } from "./partials/report";
import ColumnSelector from './partials/ColumnSelector';
import FilterSection from './partials/FilterSection';
import PresetManager from './partials/PresetManager';
import { FileText, Play } from 'lucide-react';

interface PageProps {
  allColumns: ColumnDefinition[];
  locations: Location[];
  socialStates: SocialState[];
  cardTypes: CardType[];
  housingTypes: HousingType[];
  levelStates: LevelState[];
}

export default function ReportSetup() {
  const { allColumns, locations, socialStates, cardTypes, housingTypes, levelStates } = usePage().props as PageProps;

  const [selectedColumns, setSelectedColumns] = useState<string[]>(() => 
    allColumns.map(col => col.field)
  );

  const [filters, setFilters] = useState<ReportFilters>({
    is_male: 'all',
    is_beneficiary: 'all',
    location_ids: [],
    social_state_ids: [],
    card_type_ids: [], 
    housing_type_ids: [],
    level_state_ids: [],
    has_family: 'all',
  });

  useEffect(() => {
    const savedFilters = localStorage.getItem('peopleFilters');
    const savedColumns = localStorage.getItem('peopleColumns');

    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }

    if (savedColumns) {
      setSelectedColumns(JSON.parse(savedColumns));
    }
  }, []);

  const toggleColumn = (field: string) => {
    setSelectedColumns(prev =>
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const handleSubmit = () => {
    localStorage.setItem('peopleFilters', JSON.stringify(filters));
    localStorage.setItem('peopleColumns', JSON.stringify(selectedColumns));

    router.visit('/people/report', {
      method: 'post',
      data: {
        columns: selectedColumns,
        filters,
      },
      preserveState: true,
    });
  };

  const handleLoadPreset = (preset: ReportPreset) => {
    setFilters(preset.filters);
    setSelectedColumns(preset.columns);
  };

  return (
    <AppLayout breadcrumbs={[{ title: "إعداد التقرير" }]}>
      <Head title="إعداد التقرير" />
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      
      <div className="container mx-auto px-3 py-4 max-w-7xl">
        {/* Header */}


        <div className="space-y-2">
          {/* Column Selection */}
          <ColumnSelector
            allColumns={allColumns}
            selectedColumns={selectedColumns}
            onToggleColumn={toggleColumn}
          />

          {/* Filters */}
          <FilterSection
            filters={filters}
            onFiltersChange={setFilters}
            locations={locations}
            socialStates={socialStates}
            cardTypes={cardTypes}
            housingTypes={housingTypes}
            levelStates={levelStates}
          />

          {/* Submit Button */}
          <div className="flex justify-center pb-6">
            <Button 
              onClick={handleSubmit}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="w-5 h-5 mr-2" />
              عرض التقرير
            </Button>
          </div>

          {/* Preset Manager */}
          <PresetManager
            filters={filters}
            selectedColumns={selectedColumns}
            onLoadPreset={handleLoadPreset}
          />


        </div>
      </div>
    </div>
    </AppLayout>
  );
}

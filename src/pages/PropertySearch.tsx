import React, { useState, useMemo } from 'react';
import { useProperties } from '../hooks/useProperties';
import { propertyService } from '../services/propertyService';
import PageHeader from '../components/common/PageHeader';
import SearchForm from '../components/property-search/SearchForm';
import SearchResults from '../components/property-search/SearchResults';
import ReferenceSearch from '../components/property-search/ReferenceSearch';
import PropertyDetailsModal from '../components/property-search/PropertyDetailsModal';
import { Property } from '../types/property';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

export default function PropertySearch() {
  const { properties } = useProperties();
  const [filters, setFilters] = useState({
    city: '',
    propertyTypes: [],
    minPrice: '',
    maxPrice: '',
    minSurface: '',
    maxSurface: '',
    rooms: '',
    isFurnished: null,
    isSharedLiving: null,
    exterior: [],
  });
  const [isSearching, setIsSearching] = useState(false);
  const [referenceProperty, setReferenceProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const findPropertyByReference = (reference: string) => {
    return properties.find(p => p.reference.toLowerCase() === reference.toLowerCase());
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setReferenceProperty(null);
  };

  const handleMultiSelectChange = (key: string, values: string[]) => {
    setFilters(prev => ({ ...prev, [key]: values }));
    setReferenceProperty(null);
  };

  const handleBooleanChange = (key: string, value: boolean | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setReferenceProperty(null);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setReferenceProperty(null);
  };

  const handlePropertyFound = (property: Property | null) => {
    setReferenceProperty(property);
    setIsSearching(false);
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setIsDetailsModalOpen(true);
  };

  const filteredProperties = useMemo(() => {
    if (referenceProperty) {
      return [referenceProperty];
    }

    if (!isSearching) return [];

    return properties.filter(property => {
      const totalRent = property.rentAmount + property.charges;
      
      if (filters.city && !property.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }
      
      if (filters.minPrice && totalRent < parseInt(filters.minPrice)) {
        return false;
      }
      
      if (filters.maxPrice && totalRent > parseInt(filters.maxPrice)) {
        return false;
      }
      
      if (filters.minSurface && property.surface < parseInt(filters.minSurface)) {
        return false;
      }
      
      if (filters.maxSurface && property.surface > parseInt(filters.maxSurface)) {
        return false;
      }
      
      if (filters.rooms && property.numberOfRooms !== parseInt(filters.rooms)) {
        return false;
      }
      
      if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.type)) {
        return false;
      }
      
      if (filters.isFurnished !== null && property.isFurnished !== filters.isFurnished) {
        return false;
      }
      
      if (filters.isSharedLiving !== null && property.isSharedLiving !== filters.isSharedLiving) {
        return false;
      }
      
      if (filters.exterior.length > 0 && !filters.exterior.some(ext => property.exterior.includes(ext as any))) {
        return false;
      }

      return property.status === 'available';
    });
  }, [properties, filters, isSearching, referenceProperty]);

  return (
    <div className="p-8">
      <PageHeader
        title="Recherche de bien"
        description="Trouvez le logement qui vous correspond"
      />

      <div className="space-y-8">
        <Tabs defaultValue="reference" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="reference" className="flex-1">Recherche par référence</TabsTrigger>
            <TabsTrigger value="criteria" className="flex-1">Recherche par critères</TabsTrigger>
          </TabsList>

          <TabsContent value="reference">
            <div className="space-y-8">
              <ReferenceSearch
                onPropertyFound={handlePropertyFound}
                findPropertyByReference={findPropertyByReference}
              />
              {referenceProperty && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Résultat
                  </h2>
                  <SearchResults
                    properties={[referenceProperty]}
                    onPropertySelect={handlePropertySelect}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="criteria">
            <div className="space-y-8">
              <div className="w-full">
                <SearchForm
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onMultiSelectChange={handleMultiSelectChange}
                  onBooleanChange={handleBooleanChange}
                  onSearch={handleSearch}
                />
              </div>
              {isSearching && (
                <div className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Résultats ({filteredProperties.length})
                    </h2>
                  </div>
                  <SearchResults
                    properties={filteredProperties}
                    onPropertySelect={handlePropertySelect}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
}
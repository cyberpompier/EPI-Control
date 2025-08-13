import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface EPIFilterProps {
  onFilterChange: (filters: any) => void;
}

export default function EPIFilter({ onFilterChange }: EPIFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    applyFilters(e.target.value, typeFilter, statusFilter);
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    applyFilters(searchTerm, value, statusFilter);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchTerm, typeFilter, value);
  };

  const applyFilters = (search: string, type: string, status: string) => {
    onFilterChange({
      search,
      type,
      status
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setStatusFilter('');
    onFilterChange({
      search: '',
      type: '',
      status: ''
    });
  };

  const hasActiveFilters = searchTerm || typeFilter || statusFilter;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un équipement..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          Filtres
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {(typeFilter ? 1 : 0) + (statusFilter ? 1 : 0)}
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={resetFilters} className="flex items-center gap-1">
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md border">
          <div>
            <label className="text-sm font-medium mb-1 block">Type d'équipement</label>
            <Select value={typeFilter} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les types</SelectItem>
                <SelectItem value="casque">Casque</SelectItem>
                <SelectItem value="veste">Veste</SelectItem>
                <SelectItem value="surpantalon">Surpantalon</SelectItem>
                <SelectItem value="gants">Gants</SelectItem>
                <SelectItem value="rangers">Rangers</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Statut</label>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                <SelectItem value="conforme">Conforme</SelectItem>
                <SelectItem value="non_conforme">Non conforme</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
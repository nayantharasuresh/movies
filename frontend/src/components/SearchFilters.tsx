import React from 'react';
import { Search, X } from 'lucide-react';
import { MediaFilters } from '../types';

interface SearchFiltersProps {
  filters: MediaFilters;
  onFiltersChange: (filters: MediaFilters) => void;
  onClearFilters: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, type: e.target.value });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, year: e.target.value });
  };

  const hasActiveFilters = filters.search || (filters.type && filters.type !== 'ALL') || filters.year;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Movies & TV Shows
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title, director, or location..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="MOVIE">Movies</option>
            <option value="TV_SHOW">TV Shows</option>
          </select>
        </div>

        {/* Year Filter */}
        <div className="w-full lg:w-48">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input
            type="text"
            placeholder="e.g., 2010 or 2008"
            value={filters.year}
            onChange={handleYearChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            <X size={16} className="mr-2" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filters Badges */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: "{filters.search}"
            </span>
          )}
          {filters.type && filters.type !== 'ALL' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Type: {filters.type === 'MOVIE' ? 'Movie' : 'TV Show'}
            </span>
          )}
          {filters.year && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Year: {filters.year}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
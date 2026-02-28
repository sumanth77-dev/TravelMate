import { allLanguages, allSpecialties } from "@/data/guides";
import { FilterState } from "@/types/guide";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const [open, setOpen] = useState(false);

  const hasActiveFilters =
    filters.language || filters.minRating > 0 || filters.maxPrice < 10000 || filters.specialty;

  const clearFilters = () => {
    onFilterChange({ language: "", minRating: 0, maxPrice: 10000, specialty: "" });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
            hasActiveFilters ? "border-primary bg-primary/5 text-primary" : "bg-card text-muted-foreground hover:bg-accent"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              !
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {open && (
        <div className="grid grid-cols-1 gap-3 rounded-xl border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Language</label>
            <select
              value={filters.language}
              onChange={(e) => onFilterChange({ ...filters, language: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Languages</option>
              {allLanguages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Min Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value={0}>Any Rating</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
              <option value={4.8}>4.8+ Stars</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Max Price / Day</label>
            <select
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value={10000}>Any Price</option>
              <option value={1500}>Under ₹1,500</option>
              <option value={2000}>Under ₹2,000</option>
              <option value={2500}>Under ₹2,500</option>
              <option value={3000}>Under ₹3,000</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Specialty</label>
            <select
              value={filters.specialty}
              onChange={(e) => onFilterChange({ ...filters, specialty: e.target.value })}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Specialties</option>
              {allSpecialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;

import { useState, useMemo } from "react";
import { guides } from "@/data/guides";
import { FilterState } from "@/types/guide";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";
import GuideCard from "@/components/GuideCard";
import { MapPin, Users } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    language: "",
    minRating: 0,
    maxPrice: 10000,
    specialty: "",
  });

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      if (searchQuery && !guide.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (filters.language && !guide.languages.includes(filters.language)) {
        return false;
      }
      if (filters.minRating && guide.rating < filters.minRating) {
        return false;
      }
      if (filters.maxPrice < 10000 && guide.pricePerDay > filters.maxPrice) {
        return false;
      }
      if (filters.specialty && !guide.specialties.includes(filters.specialty)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b bg-card py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Find Your Perfect Guide
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Discover experienced local guides for your next adventure. Search by destination to get started.
          </p>
          <div className="mt-8">
            <SearchBar onSearch={setSearchQuery} value={searchQuery} />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            {searchQuery ? (
              <h2 className="text-lg font-semibold text-foreground">
                Guides near{" "}
                <span className="text-primary">{searchQuery}</span>
              </h2>
            ) : (
              <h2 className="text-lg font-semibold text-foreground">All Guides</h2>
            )}
            <p className="text-sm text-muted-foreground">
              {filteredGuides.length} guide{filteredGuides.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="mt-12 text-center">
            <MapPin className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">No guides found for this search. Try a different location or adjust filters.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;

import { Search } from "lucide-react";
import { useState, useRef } from "react";
import { locations } from "@/data/guides";

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
}

const SearchBar = ({ onSearch, value }: SearchBarProps) => {
  const [focused, setFocused] = useState(false);
  const [input, setInput] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredLocations = input
    ? locations.filter((l) => l.toLowerCase().includes(input.toLowerCase()))
    : locations;

  const handleSelect = (location: string) => {
    setInput(location);
    onSearch(location);
    setFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
    setFocused(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search a place... e.g. Jaipur, Goa, Kerala"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (!e.target.value) onSearch("");
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="w-full rounded-xl border bg-card py-3.5 pl-12 pr-4 text-sm shadow-sm transition-shadow placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-md"
        />
      </form>
      {focused && filteredLocations.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border bg-card p-2 shadow-lg animate-fade-in">
          {filteredLocations.map((loc) => (
            <button
              key={loc}
              onMouseDown={() => handleSelect(loc)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

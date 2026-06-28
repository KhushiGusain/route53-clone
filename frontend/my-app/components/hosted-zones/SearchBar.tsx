"use client";

import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HostedZone, ZoneType } from "@/lib/types";

export type SearchProperty = "name" | "type";

export type HostedZoneFilter = {
  property: SearchProperty;
  value: string;
} | null;

const PROPERTY_OPTIONS: { value: SearchProperty; label: string; chipLabel: string }[] =
  [
    { value: "name", label: "Hosted Zone Name", chipLabel: "Hosted Zone Name" },
    { value: "type", label: "Type", chipLabel: "Type" },
  ];

const TYPE_SUGGESTIONS: ZoneType[] = ["Public", "Private"];

type SearchBarProps = {
  zones: HostedZone[];
  filter: HostedZoneFilter;
  onFilterChange: (filter: HostedZoneFilter) => void;
};

function getPropertyLabel(property: SearchProperty) {
  return PROPERTY_OPTIONS.find((option) => option.value === property)?.label ?? "";
}

function getChipLabel(property: SearchProperty) {
  return PROPERTY_OPTIONS.find((option) => option.value === property)?.chipLabel ?? "";
}

export default function SearchBar({ zones, filter, onFilterChange }: SearchBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedProperty, setSelectedProperty] = useState<SearchProperty | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");
  const [showPropertyMenu, setShowPropertyMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const uniqueZoneNames = useMemo(
    () => [...new Set(zones.map((zone) => zone.name))].sort(),
    [zones]
  );

  const suggestions = useMemo(() => {
    if (!selectedProperty) {
      return [];
    }

    const query = inputValue.trim().toLowerCase();
    const source =
      selectedProperty === "name" ? uniqueZoneNames : TYPE_SUGGESTIONS;

    if (!query) {
      return source;
    }

    return source.filter((item) => item.toLowerCase().includes(query));
  }, [selectedProperty, inputValue, uniqueZoneNames]);

  const placeholder = selectedProperty
    ? `${getPropertyLabel(selectedProperty)}:`
    : "Filter records by property or value";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowPropertyMenu(false);
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function resetSearchInput() {
    setSelectedProperty(null);
    setInputValue("");
    setShowPropertyMenu(false);
    setShowSuggestions(false);
    inputRef.current?.blur();
  }

  function applyFilter(value: string) {
    const trimmed = value.trim();

    if (!selectedProperty || !trimmed) {
      return;
    }

    onFilterChange({ property: selectedProperty, value: trimmed });
    resetSearchInput();
  }

  function handlePropertySelect(property: SearchProperty) {
    setSelectedProperty(property);
    setInputValue("");
    setShowPropertyMenu(false);
    setShowSuggestions(true);
    inputRef.current?.focus();
  }

  function handleInputFocus() {
    if (!selectedProperty) {
      setShowPropertyMenu(true);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    setShowPropertyMenu(false);
  }

  function handleSuggestionSelect(value: string) {
    applyFilter(value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      applyFilter(inputValue);
    }
  }

  function clearFilter() {
    onFilterChange(null);
    resetSearchInput();
  }

  const dropdownClass =
    "absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded border border-aws-main-border bg-aws-main-elevated shadow-lg";

  const dropdownItemClass =
    "block w-full cursor-pointer px-3 py-2 text-left text-ui text-aws-main-text transition-colors hover:bg-aws-accent/20";

  return (
    <section className="min-w-0 flex-1" ref={containerRef}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-aws-main-text-muted" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (selectedProperty) {
              setShowSuggestions(true);
            }
          }}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded border border-aws-main-border/70 bg-aws-main-elevated py-1.5 pl-9 pr-4 text-ui text-aws-main-text placeholder:text-aws-main-text-muted focus:border-aws-accent focus:outline-none focus:ring-1 focus:ring-aws-accent/30"
        />

        {showPropertyMenu && (
          <div className={dropdownClass} role="listbox" aria-label="Search properties">
            {PROPERTY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                className={dropdownItemClass}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePropertySelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {showSuggestions && selectedProperty && suggestions.length > 0 && (
          <div className={dropdownClass} role="listbox" aria-label="Search suggestions">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                role="option"
                className={dropdownItemClass}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {filter && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center overflow-hidden rounded border border-aws-accent bg-aws-main-elevated">
            <span className="border-r border-aws-accent/60 px-2.5 py-1 text-ui text-aws-main-text">
              <span className="border-b border-dotted border-aws-main-text-secondary">
                {getChipLabel(filter.property)}
              </span>
              <span className="text-aws-main-text-secondary"> : </span>
              {filter.value}
            </span>
            <button
              type="button"
              onClick={clearFilter}
              className="px-2 py-1 text-aws-main-text-secondary transition-colors hover:bg-aws-accent/20 hover:text-aws-main-text"
              aria-label="Remove filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className="h-4 w-px bg-aws-main-border" aria-hidden="true" />

          <button
            type="button"
            onClick={clearFilter}
            className="rounded border border-aws-accent px-2.5 py-1 text-ui text-aws-link transition-colors hover:bg-aws-accent/10"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

export function filterHostedZones(
  zones: HostedZone[],
  filter: HostedZoneFilter
): HostedZone[] {
  if (!filter) {
    return zones;
  }

  const query = filter.value.toLowerCase();

  if (filter.property === "name") {
    return zones.filter((zone) => zone.name.toLowerCase().includes(query));
  }

  return zones.filter((zone) => zone.type.toLowerCase() === query.toLowerCase());
}

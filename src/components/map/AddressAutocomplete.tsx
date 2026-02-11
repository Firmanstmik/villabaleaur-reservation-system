import React, { useState, useRef, useEffect, useDeferredValue } from 'react';
import { Loader2, AlertCircle, X, ChevronDown } from 'lucide-react';
import { geocodeAddress, GeocodingResult } from '@/lib/mapbox';
import { getCountryFlag, getSupportedCountries } from '@/lib/country-flags';
import { cn } from '@/lib/utils';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: GeocodingResult) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Start typing your property address...',
  error,
  disabled = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string | null>(null);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const deferredValue = useDeferredValue(value);

  // Fetch suggestions when input changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!deferredValue || deferredValue.length < 3) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const results = await geocodeAddress(deferredValue, {
          country: selectedCountryFilter || undefined,
        });

        // Update selected country code from first result if available
        if (results.length > 0 && results[0].countryCode) {
          setSelectedCountryCode(results[0].countryCode);
        }

        setSuggestions(results);
        setShowDropdown(results.length > 0);
        setHighlightedIndex(-1);

        if (results.length === 0) {
          setErrorMessage('No addresses found. Try a different search.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to search addresses';
        setErrorMessage(message);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [deferredValue, selectedCountryFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter' && value && value.length >= 3) {
        setShowDropdown(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: GeocodingResult) => {
    onChange(suggestion.formattedAddress); // Use full formatted address
    onSelect(suggestion);
    setSelectedCountryCode(suggestion.countryCode || null);
    setShowDropdown(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    setErrorMessage(null);
  };

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowDropdown(false);
    setErrorMessage(null);
    setSelectedCountryCode(null);
    inputRef.current?.focus();
  };

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountryFilter(countryCode);
    setShowCountryDropdown(false);
  };

  const currentCountryFlag = getCountryFlag(selectedCountryCode);
  const supportedCountries = getSupportedCountries();

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        {/* Country Flag Button */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <div ref={countryDropdownRef} className="relative">
            <button
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-white border border-border/50 hover:border-border hover:bg-secondary/10 transition-all"
              title="Filter by country"
            >
              <span className="text-xl">{currentCountryFlag}</span>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>

            {/* Country Dropdown */}
            {showCountryDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-border rounded-2xl shadow-lg z-50 w-64 max-h-96 overflow-y-auto">
                {/* Clear filter option */}
                <button
                  onClick={() => {
                    setSelectedCountryFilter(null);
                    setShowCountryDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-secondary/30 border-b border-border/50 font-medium text-sm"
                >
                  🌍 All Countries
                </button>

                {/* Country list */}
                {supportedCountries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => handleCountrySelect(country.code)}
                    className={cn(
                      'w-full text-left px-4 py-3 transition-colors border-b border-border/30 last:border-b-0',
                      selectedCountryFilter === country.code
                        ? 'bg-[#0e2e50]/10 font-semibold'
                        : 'hover:bg-secondary/30'
                    )}
                  >
                    <span className="text-xl mr-2">{getCountryFlag(country.code)}</span>
                    {country.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value && value.length >= 3 && suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          aria-autocomplete="list"
          aria-controls="address-suggestions"
          aria-expanded={showDropdown}
          aria-activedescendant={
            highlightedIndex >= 0
              ? `suggestion-${highlightedIndex}`
              : undefined
          }
          className={cn(
            'w-full pl-24 pr-16 h-16 rounded-[1.5rem] bg-secondary/5 font-medium',
            'border focus:outline-none focus:ring-2 focus:ring-[#0e2e50]/20',
            'transition-all duration-200 disabled:opacity-50',
            error || errorMessage
              ? 'border-ukon-red ring-1 ring-ukon-red'
              : 'border-border'
          )}
        />

        {/* Clear button */}
        {value && !disabled && (
          <button
            onClick={handleClear}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Clear address"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2">
            <Loader2 size={20} className="text-[#0e2e50] animate-spin" />
          </div>
        )}
      </div>

      {/* Error message */}
      {(error || errorMessage) && (
        <div className="flex items-center gap-2 mt-2 ml-2 text-xs text-ukon-red font-bold">
          <AlertCircle size={14} />
          <span>{error || errorMessage}</span>
        </div>
      )}

      {/* Dropdown suggestions */}
      {showDropdown && suggestions.length > 0 && (
        <ul
          id="address-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-2xl shadow-lg z-50 overflow-hidden"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.latitude}-${suggestion.longitude}-${index}`}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={cn(
                'px-6 py-4 cursor-pointer transition-colors border-b last:border-b-0',
                index === highlightedIndex
                  ? 'bg-[#0e2e50]/10 text-[#0e2e50]'
                  : 'bg-white text-foreground hover:bg-secondary/30'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5 flex-shrink-0">
                  {getCountryFlag(suggestion.countryCode)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">
                    {suggestion.formattedAddress}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {suggestion.city && suggestion.country
                      ? `${suggestion.city}, ${suggestion.country}`
                      : suggestion.placeType}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

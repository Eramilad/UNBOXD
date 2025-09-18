import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface AddressInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

interface AddressSuggestion {
  id: string;
  display_name: string;
  lat: string;
  lon: string;
}

const AddressInput = ({ placeholder, value, onChange, className = '' }: AddressInputProps) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using Nominatim (OpenStreetMap) for address suggestions with Nigeria focus
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&countrycodes=ng&q=${encodeURIComponent(query + ', Nigeria')}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce the search
    timeoutRef.current = setTimeout(() => {
      searchAddresses(newValue);
      setIsOpen(true);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onChange(suggestion.display_name);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow suggestion clicks
    setTimeout(() => setIsOpen(false), 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className={`flex items-center space-x-3 ${className}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1 outline-none text-gray-700 bg-transparent"
        />
        <MapPin className="h-5 w-5 text-gray-400" />
      </div>
      
      {isOpen && (suggestions.length > 0 || isLoading) && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
          {isLoading ? (
            <div className="p-3 text-gray-500 text-sm">
              Searching...
            </div>
          ) : (
            suggestions.map((suggestion) => (
              <button
                key={suggestion.id || suggestion.display_name}
                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 truncate">
                  {suggestion.display_name}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AddressInput;
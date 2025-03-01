import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { serviceCategories } from '../data';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = '' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredCategories = serviceCategories.filter(category =>
    category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsInputFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (category: string) => {
    navigate(`/category/${category.toLowerCase()}`);
    setShowSuggestions(false);
    setQuery('');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div
          className={`relative transition-all duration-300 ${
            isInputFocused ? 'transform scale-105' : ''
          }`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setShowSuggestions(true);
              setIsInputFocused(true);
            }}
            placeholder="Search for services..."
            className="w-full px-6 py-4 pl-12 rounded-lg border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-lg shadow-lg transition-shadow duration-300"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50 animate-scaleIn">
          {filteredCategories.length > 0 ? (
            <div className="py-2">
              {filteredCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSearch(category)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between group transition-colors duration-200"
                >
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
                    {category}
                  </span>
                  <div className="flex items-center text-gray-400 group-hover:text-blue-600 transition-colors">
                    <Search className="h-4 w-4 mr-1" />
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No services found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching for a different service
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
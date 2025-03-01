import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { serviceProviders } from '../data';
import ServiceCard from '../components/ServiceCard';
import { Scale as Male, Scale as Female, Filter, MapPin } from 'lucide-react';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedState, setSelectedState] = useState<string>(searchParams.get('state') || 'all');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const state = searchParams.get('state');
    if (state) {
      setSelectedState(state);
    }
  }, [searchParams]);

  const filteredProviders = serviceProviders.filter(provider => {
    const categoryMatch = provider.category === category;
    const genderMatch = selectedGender === 'all' || provider.gender === selectedGender;
    const stateMatch = selectedState === 'all' || provider.state === selectedState;
    return categoryMatch && genderMatch && stateMatch;
  });

  const indianStates = [
    'All States',
    'Andhra Pradesh',
    'Delhi',
    'Gujarat',
    'Karnataka',
    'Kerala',
    'Maharashtra',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'West Bengal'
  ];

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSearchParams({ state });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {category} Services
              </h1>
              <p className="mt-2 text-gray-600">
                Find the best {category}s in your area
              </p>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            <div className={`${showFilters ? 'block' : 'hidden'} md:block space-y-4 md:space-y-0 md:flex md:items-center md:space-x-6`}>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                >
                  {indianStates.map((state) => (
                    <option key={state} value={state === 'All States' ? 'all' : state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setSelectedGender('all')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    selectedGender === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  <span>All</span>
                </button>
                <button
                  onClick={() => setSelectedGender('male')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    selectedGender === 'male'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  <Male className="h-5 w-5" />
                  <span>Male</span>
                </button>
                <button
                  onClick={() => setSelectedGender('female')}
                  className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                    selectedGender === 'female'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  } transition-colors duration-200`}
                >
                  <Female className="h-5 w-5" />
                  <span>Female</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProviders.map(provider => (
            <ServiceCard key={provider.id} provider={provider} />
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No providers found</h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your filters or searching for a different category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
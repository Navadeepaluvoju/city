import { ArrowRight, Wrench, Camera, Hammer, Paintbrush, Settings, Baby, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { serviceCategories } from '../data';

const categoryIcons = {
  'Plumber': Wrench,
  'Carpenter': Hammer,
  'Photographer': Camera,
  'Mechanic': Settings,
  'Technician': Settings,
  'Babysitter': Baby,
  'Electrician': Zap,
  'Cleaner': Sparkles,
  'Painter': Paintbrush
};

const categoryImages = {
  'Plumber': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60',
  'Carpenter': 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800&auto=format&fit=crop&q=60',
  'Photographer': 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&auto=format&fit=crop&q=60',
  'Mechanic': 'https://images.unsplash.com/photo-1632823471565-1ec2f83cdc88?w=800&auto=format&fit=crop&q=60',
  'Technician': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=60',
  'Babysitter': 'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=800&auto=format&fit=crop&q=60',
  'Electrician': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=60',
  'Cleaner': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60',
  'Painter': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60'
};

const categoryDescriptions = {
  'Plumber': 'Expert plumbers for all your pipe and fixture needs',
  'Carpenter': 'Skilled carpenters for woodwork and furniture',
  'Photographer': 'Professional photographers for events and portraits',
  'Mechanic': 'Experienced mechanics for vehicle repairs and maintenance',
  'Technician': 'Technical experts for appliance and equipment repairs',
  'Babysitter': 'Trusted childcare professionals for your family',
  'Electrician': 'Licensed electricians for all electrical work',
  'Cleaner': 'Professional cleaning services for homes and offices',
  'Painter': 'Expert painters for interior and exterior painting'
};

export default function Home() {
  const categories = serviceCategories.map(category => ({
    name: category,
    path: `/category/${category.toLowerCase()}`,
    icon: categoryIcons[category],
    description: categoryDescriptions[category],
    bgImage: categoryImages[category]
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&auto=format&fit=crop&q=60"
            alt="Hero background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Find Expert Service Providers
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Connect with skilled professionals in your area for all your home service needs
            </p>
            
            {/* Search Component */}
            <div className="mt-10 max-w-3xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Popular Services
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="absolute inset-0">
                <img
                  src={category.bgImage}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
              </div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full">
                    <category.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <ArrowRight className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="mt-20">
                  <h3 className="text-2xl font-semibold text-white mb-2">{category.name}</h3>
                  <p className="text-gray-200">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Professionals</h3>
              <p className="text-gray-600">Verified experts with proven experience</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Service</h3>
              <p className="text-gray-600">Guaranteed satisfaction with every booking</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Platform</h3>
              <p className="text-gray-600">Safe and secure service booking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
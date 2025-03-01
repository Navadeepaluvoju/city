import { Star, MapPin, Clock, Phone, MessageCircle, Shield, Award } from 'lucide-react';
import { ServiceProvider } from '../types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  provider: ServiceProvider;
}

export default function ServiceCard({ provider }: ServiceCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleContact = () => {
    // Check if it's a mobile device
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = `tel:${provider.contact}`;
    } else {
      // Show contact info in a tooltip or modal for desktop
      alert(`Contact ${provider.name} at ${provider.contact}`);
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi ${provider.name}, I found you on City Services and I'm interested in your services.`;
    const whatsappUrl = `https://wa.me/${provider.contact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="card group">
      <div className="relative">
        {/* Skeleton loader */}
        <div className={`w-full h-56 bg-gray-200 ${!isImageLoaded ? 'skeleton' : 'hidden'}`} />
        
        <img
          src={provider.image}
          alt={provider.name}
          className={`w-full h-56 object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {/* Rating badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg transform transition-transform group-hover:scale-110">
          <div className="flex items-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= provider.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-1 font-medium">{provider.rating}</span>
          </div>
        </div>

        {/* Experience badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
          <div className="flex items-center">
            <Award className="h-4 w-4 text-blue-600" />
            <span className="ml-1 font-medium">{provider.experience}+ years</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link
              to={`/worker/${provider.id}`}
              className="group/name inline-block"
            >
              <h3 className="text-xl font-semibold text-gray-900 group-hover/name:text-blue-600 transition-colors">
                {provider.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <Shield className="h-4 w-4 text-green-500 mr-1" />
              Verified Provider
            </p>
          </div>
          <div className="text-right">
            <span className="text-blue-600 font-medium text-lg">₹{provider.pricePerDay}</span>
            <p className="text-sm text-gray-500">per day</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
            <Clock className="h-5 w-5 mr-2 text-gray-400" />
            <span>{provider.experience} years experience</span>
          </div>
          <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
            <MapPin className="h-5 w-5 mr-2 text-gray-400" />
            <span>{provider.state}</span>
          </div>
          <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
            <Phone className="h-5 w-5 mr-2 text-gray-400" />
            <span>{provider.contact}</span>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
          {provider.description}
        </p>
        
        <div className="mt-6 pt-4 border-t space-y-3">
          <button
            onClick={handleContact}
            className="btn btn-primary w-full group-hover:bg-blue-700 transform transition-transform active:scale-95"
          >
            <Phone className="h-5 w-5 mr-2" />
            Call Now
          </button>
          
          <button
            onClick={handleWhatsApp}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center transform active:scale-95"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
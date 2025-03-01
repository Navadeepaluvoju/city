import { Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Offers() {
  const offers = [
    {
      title: "First Booking Discount",
      description: "Get 20% off on your first service booking",
      code: "FIRST20",
      validUntil: "2025-03-31",
      category: "all"
    },
    {
      title: "Weekend Special",
      description: "Book any service on weekends and get 10% off",
      code: "WEEKEND10",
      validUntil: "2025-03-31",
      category: "all"
    },
    {
      title: "Plumbing Services",
      description: "15% off on all plumbing services this month",
      code: "PLUMB15",
      validUntil: "2025-03-31",
      category: "plumber"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Special Offers</h1>
        <p className="mt-2 text-gray-600">Exclusive deals and discounts on our services</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Tag className="h-8 w-8 text-blue-600" />
                <span className="text-sm font-medium text-gray-500">
                  Valid until {new Date(offer.validUntil).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {offer.title}
              </h3>
              <p className="text-gray-600 mb-4">{offer.description}</p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">Use code:</p>
                <p className="text-lg font-mono font-bold text-blue-600">{offer.code}</p>
              </div>
              
              {offer.category !== 'all' && (
                <Link
                  to={`/category/${offer.category}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  View {offer.category} services
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
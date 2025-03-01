import { ServiceProvider } from './types';

export const serviceCategories = [
  'Plumber',
  'Carpenter',
  'Photographer',
  'Mechanic',
  'Technician',
  'Babysitter',
  'Electrician',
  'Cleaner',
  'Painter'
] as const;

export const customerCare = {
  phone: '1800-123-4567',
  email: 'support@cityservices.com',
  hours: '24/7'
};

export const serviceProviders: ServiceProvider[] = [
  {
    id: 1,
    name: "John Smith",
    category: "plumber",
    pricePerDay: 150,
    contact: "+1 (555) 123-4567",
    rating: 4.8,
    experience: 8,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60",
    description: "Specialized in residential plumbing with expertise in leak detection and repair.",
    gender: "male",
    state: "Maharashtra"
  },
  {
    id: 2,
    name: "Mike Johnson",
    category: "carpenter",
    pricePerDay: 180,
    contact: "+1 (555) 234-5678",
    rating: 4.9,
    experience: 12,
    image: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=800&auto=format&fit=crop&q=60",
    description: "Custom furniture maker with extensive experience in home renovations.",
    gender: "male",
    state: "Delhi"
  },
  {
    id: 3,
    name: "Sarah Williams",
    category: "photographer",
    pricePerDay: 250,
    contact: "+1 (555) 345-6789",
    rating: 4.7,
    experience: 6,
    image: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&auto=format&fit=crop&q=60",
    description: "Professional photographer specializing in weddings and events.",
    gender: "female",
    state: "Karnataka"
  },
  // Add more sample providers for new categories
  {
    id: 4,
    name: "Alex Turner",
    category: "mechanic",
    pricePerDay: 200,
    contact: "+1 (555) 456-7890",
    rating: 4.8,
    experience: 10,
    image: "https://images.unsplash.com/photo-1632823471565-1ec2f83cdc88?w=800&auto=format&fit=crop&q=60",
    description: "Expert auto mechanic specializing in all types of vehicle repairs.",
    gender: "male",
    state: "Gujarat"
  },
  {
    id: 5,
    name: "Emma Davis",
    category: "babysitter",
    pricePerDay: 120,
    contact: "+1 (555) 567-8901",
    rating: 4.9,
    experience: 5,
    image: "https://images.unsplash.com/photo-1543342384-1f1350e27861?w=800&auto=format&fit=crop&q=60",
    description: "Certified childcare professional with first-aid training.",
    gender: "female",
    state: "Kerala"
  },
  {
    id: 6,
    name: "David Chen",
    category: "electrician",
    pricePerDay: 180,
    contact: "+1 (555) 678-9012",
    rating: 4.7,
    experience: 8,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=60",
    description: "Licensed electrician for residential and commercial projects.",
    gender: "male",
    state: "Tamil Nadu"
  }
];
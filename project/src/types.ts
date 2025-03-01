export interface ServiceProvider {
  id: number;
  name: string;
  category: string;
  pricePerDay: number;
  contact: string;
  rating: number;
  experience: number;
  image: string;
  description: string;
  gender: 'male' | 'female';
  state: string;
}
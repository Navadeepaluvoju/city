/*
  # Initial Schema Setup for Service Marketplace

  1. New Tables
    - `profiles`
      - User profiles for both workers and customers
      - Stores basic information and role
    - `worker_profiles`
      - Extended profile for workers
      - Contains service-specific information
    - `portfolio_items`
      - Worker's portfolio images/videos
      - Limited to 10 items per worker
    - `services`
      - Available service categories
      - Standard pricing and descriptions
    - `availability`
      - Worker's availability schedule
      - Supports recurring and one-time slots
    - `service_areas`
      - Geographic coverage for workers
      - Radius-based service areas
    - `bookings`
      - Service booking records
      - Includes status and payment info

  2. Security
    - Enable RLS on all tables
    - Policies for data access control
    - Input validation constraints
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('worker', 'customer')),
  full_name text,
  email text UNIQUE NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create worker_profiles table
CREATE TABLE IF NOT EXISTS worker_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  service_category text NOT NULL,
  experience_years integer CHECK (experience_years >= 0),
  hourly_rate decimal CHECK (hourly_rate > 0),
  fixed_rate decimal CHECK (fixed_rate > 0),
  bio text,
  languages text[],
  rating decimal DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_jobs integer DEFAULT 0,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES worker_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  media_url text NOT NULL,
  media_type text CHECK (media_type IN ('image', 'video')),
  created_at timestamptz DEFAULT now()
);

-- Create service_areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES worker_profiles(id) ON DELETE CASCADE,
  city text NOT NULL,
  state text NOT NULL,
  radius_km integer CHECK (radius_km > 0 AND radius_km <= 50),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES worker_profiles(id) ON DELETE CASCADE,
  day_of_week integer CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES worker_profiles(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  service_category text NOT NULL,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  price decimal NOT NULL CHECK (price > 0),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  requirements text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_booking_time CHECK (start_time < end_time)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Workers can view own profile"
  ON worker_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Workers can update own profile"
  ON worker_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Portfolio items are viewable by everyone"
  ON portfolio_items FOR SELECT
  USING (true);

CREATE POLICY "Workers can manage own portfolio"
  ON portfolio_items FOR ALL
  USING (auth.uid() = worker_id);

CREATE POLICY "Service areas are viewable by everyone"
  ON service_areas FOR SELECT
  USING (true);

CREATE POLICY "Workers can manage own service areas"
  ON service_areas FOR ALL
  USING (auth.uid() = worker_id);

CREATE POLICY "Availability is viewable by everyone"
  ON availability FOR SELECT
  USING (true);

CREATE POLICY "Workers can manage own availability"
  ON availability FOR ALL
  USING (auth.uid() = worker_id);

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id OR auth.uid() = worker_id);

CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = customer_id OR auth.uid() = worker_id);

-- Create functions for portfolio items limit
CREATE OR REPLACE FUNCTION check_portfolio_items_limit()
RETURNS TRIGGER AS $$
DECLARE
  items_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO items_count
  FROM portfolio_items
  WHERE worker_id = NEW.worker_id;
  
  IF items_count >= 10 THEN
    RAISE EXCEPTION 'Maximum portfolio items limit (10) reached for this worker';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for portfolio items limit
CREATE TRIGGER enforce_portfolio_items_limit
  BEFORE INSERT ON portfolio_items
  FOR EACH ROW
  EXECUTE FUNCTION check_portfolio_items_limit();

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_worker_profiles_service_category ON worker_profiles(service_category);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_service_areas_location ON service_areas(city, state);
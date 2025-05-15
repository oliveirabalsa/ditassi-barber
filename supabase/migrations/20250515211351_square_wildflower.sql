/*
  # Initial database schema for barber booking application

  1. New Tables
    - `services`: Stores information about the barber services
    - `clients`: Stores client information
    - `barbers`: Information about barbers (single barber for now)
    - `appointments`: Stores appointment bookings
    - `reviews`: Stores client reviews for appointments
    - `admins`: Stores admin user IDs for access control
    - `business_hours`: Defines the barber's working hours
    - `blocked_dates`: For storing vacation days and other unavailable dates

  2. Security
    - Enable RLS on all tables
    - Set appropriate access policies for each table
*/

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration_minutes integer NOT NULL,
  price_cents integer NOT NULL,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY,  -- Will use the auth.users id
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Barbers table
CREATE TABLE IF NOT EXISTS barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id),
  name text NOT NULL,
  bio text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id),
  service_id uuid REFERENCES services(id),
  barber_id uuid REFERENCES barbers(id),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES appointments(id),
  client_id uuid REFERENCES clients(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Admins table (for identifying admin users)
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Business hours table
CREATE TABLE IF NOT EXISTS business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0 = Sunday, 6 = Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Blocked dates (for vacations, holidays, etc.)
CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Services are viewable by everyone" 
  ON services FOR SELECT 
  USING (true);

CREATE POLICY "Services can be inserted by admins" 
  ON services FOR INSERT 
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

CREATE POLICY "Services can be updated by admins" 
  ON services FOR UPDATE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

CREATE POLICY "Services can be deleted by admins" 
  ON services FOR DELETE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

-- Clients policies
CREATE POLICY "Clients can view their own data" 
  ON clients FOR SELECT 
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can view all clients" 
  ON clients FOR SELECT 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

CREATE POLICY "Clients can insert their own data" 
  ON clients FOR INSERT 
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Clients can update their own data" 
  ON clients FOR UPDATE 
  TO authenticated
  USING (id = auth.uid());

-- Barbers policies
CREATE POLICY "Barbers are viewable by everyone" 
  ON barbers FOR SELECT 
  USING (true);

CREATE POLICY "Barbers can be managed by admins" 
  ON barbers FOR ALL 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

-- Appointments policies
CREATE POLICY "Clients can view their own appointments" 
  ON appointments FOR SELECT 
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Admins can view all appointments" 
  ON appointments FOR SELECT 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

CREATE POLICY "Clients can insert their own appointments" 
  ON appointments FOR INSERT 
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Anonymous users can create appointments" 
  ON appointments FOR INSERT 
  TO anon
  WITH CHECK (true);

CREATE POLICY "Clients can update their own appointments" 
  ON appointments FOR UPDATE 
  TO authenticated
  USING (client_id = auth.uid() AND status NOT IN ('completed', 'no-show'));

CREATE POLICY "Admins can update any appointment" 
  ON appointments FOR UPDATE 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT 
  USING (true);

CREATE POLICY "Clients can insert reviews for their appointments" 
  ON reviews FOR INSERT 
  TO authenticated
  WITH CHECK (
    client_id = auth.uid() AND 
    EXISTS (
      SELECT 1 FROM appointments 
      WHERE appointments.id = appointment_id 
      AND appointments.client_id = auth.uid()
      AND appointments.status = 'completed'
    )
  );

CREATE POLICY "Clients can update their own reviews" 
  ON reviews FOR UPDATE 
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Admins can manage all reviews" 
  ON reviews FOR ALL 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

-- Admins policies
CREATE POLICY "Admins can be managed by admins" 
  ON admins FOR ALL 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

-- Business hours policies
CREATE POLICY "Business hours are viewable by everyone" 
  ON business_hours FOR SELECT 
  USING (true);

CREATE POLICY "Business hours can be managed by admins" 
  ON business_hours FOR ALL 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

-- Blocked dates policies
CREATE POLICY "Blocked dates are viewable by everyone" 
  ON blocked_dates FOR SELECT 
  USING (true);

CREATE POLICY "Blocked dates can be managed by admins" 
  ON blocked_dates FOR ALL 
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE user_id = auth.uid()
  ));

-- Insert default barber
INSERT INTO barbers (name, bio, image_url)
VALUES (
  'John Davis', 
  'Master barber with over 10 years of experience specializing in classic and modern cuts.', 
  'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg'
);

-- Insert some default services
INSERT INTO services (name, description, duration_minutes, price_cents, active)
VALUES 
  ('Classic Haircut', 'Traditional haircut with clippers and scissors, includes wash and style.', 30, 3000, true),
  ('Fade Haircut', 'Precision fade haircut with your choice of style on top.', 45, 3500, true),
  ('Beard Trim', 'Shape and trim your beard to perfection.', 15, 1500, true),
  ('Haircut & Beard Combo', 'Complete package with haircut and beard trim.', 45, 4500, true),
  ('Hot Towel Shave', 'Traditional hot towel shave with straight razor.', 30, 3000, true);

-- Insert default business hours (Monday-Saturday, 9AM-6PM, closed Sunday)
INSERT INTO business_hours (day_of_week, start_time, end_time)
VALUES 
  (1, '09:00:00', '18:00:00'), -- Monday
  (2, '09:00:00', '18:00:00'), -- Tuesday
  (3, '09:00:00', '18:00:00'), -- Wednesday
  (4, '09:00:00', '18:00:00'), -- Thursday
  (5, '09:00:00', '18:00:00'), -- Friday
  (6, '09:00:00', '16:00:00'); -- Saturday (shorter hours)
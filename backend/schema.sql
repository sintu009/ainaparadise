-- Run this file once to set up the database
-- psql -U postgres -d aina_paradise -f schema.sql

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  size INTEGER,
  max_person INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  image_url VARCHAR(500),
  image_lg_url VARCHAR(500),
  facilities TEXT[],
  images TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  room_id INTEGER REFERENCES rooms(id) ON DELETE SET NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INTEGER DEFAULT 1,
  kids INTEGER DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  guest_name VARCHAR(100),
  guest_email VARCHAR(150),
  guest_phone VARCHAR(30),
  special_requests TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed default admin
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@ainaparadise.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Seed rooms
INSERT INTO rooms (name, description, size, max_person, price, facilities) VALUES
('Superior Room', 'A cozy room perfect for solo travelers with all essential amenities.', 30, 1, 115, ARRAY['Wifi','Coffee','Bath','Parking Space','Swimming Pool','Breakfast','GYM','Drinks']),
('Signature Room', 'Elegant room designed for couples with premium furnishings.', 70, 2, 220, ARRAY['Wifi','Coffee','Bath','Parking Space','Swimming Pool','Breakfast','GYM','Drinks']),
('Deluxe Room', 'Spacious deluxe room ideal for small families.', 50, 3, 265, ARRAY['Wifi','Coffee','Bath','Parking Space','Swimming Pool','Breakfast','GYM','Drinks']),
('Luxury Room', 'Premium luxury room with stunning views and top-tier amenities.', 50, 4, 289, ARRAY['Wifi','Coffee','Bath','Parking Space','Swimming Pool','Breakfast','GYM','Drinks']),
('Luxury Suite Room', 'Our finest suite with a private lounge and panoramic views.', 90, 5, 320, ARRAY['Wifi','Coffee','Bath','Parking Space','Swimming Pool','Breakfast','GYM','Drinks']),
('Deluxe Family Room', 'Comfortable deluxe room for larger families.', 45, 6, 344, ARRAY['Wifi','Coffee','Bath','Parking Space','Swimming Pool','Breakfast','GYM','Drinks']),
('Grand Luxury Room', 'Grand luxury experience with butler service.', 84, 7, 389, ARRAY['Wifi','Coffee','Bath','Parking Space','Swimming Pool','Breakfast','GYM','Drinks']),
('Presidential Suite', 'The ultimate in luxury — our presidential suite.', 48, 8, 499, ARRAY['Wifi','Coffee','Bath','Parking Space','Swimming Pool','Breakfast','GYM','Drinks'])
ON CONFLICT DO NOTHING;

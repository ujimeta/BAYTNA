// ============================================================
// MOCK API CLIENT for Baytna Frontend
// Replaces @/lib/api-client for standalone deployment
// ============================================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ──────────────────────────────────────────────────

export interface Agent {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  agency: string;
  listingsCount?: number;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  status: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number | null;
  yearBuilt: number | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  verified: boolean;
  coverImage: string;
  images: string[];
  features: string[];
  agentId: number;
  agent: Agent;
  videoUrl: string | null;
  createdAt: string;
}

export interface CityData {
  city: string;
  count: number;
  coverImage: string;
}

export interface MarketStats {
  totalListings: number;
  avgSalePrice: number;
  cityCount: number;
  agentCount: number;
}

export interface HomeStats {
  listingCount: number;
  agentCount: number;
  cityCount: number;
}

export interface Inquiry {
  id: number;
  propertyId: number;
  agentId: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  createdAt: string;
}

export interface Inspection {
  id: number;
  propertyId: number;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
  createdAt: string;
}

// ─── Demo Data ──────────────────────────────────────────────

const AGENTS: Agent[] = [
  { id: 1, name: "Chinedu Okonkwo", title: "Senior Property Consultant", email: "chinedu@lagosrealty.ng", phone: "+234 803 456 7890", bio: "With over 12 years of experience in Lagos luxury real estate, Chinedu has facilitated transactions worth over ₦5 billion.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", agency: "Lagos Realty Ltd", listingsCount: 8 },
  { id: 2, name: "Amina Bello", title: "Luxury Homes Specialist", email: "amina@abujaelite.ng", phone: "+234 805 234 5678", bio: "Amina is Abuja's premier luxury property specialist, focusing on Maitama, Asokoro, and Wuse 2.", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face", agency: "Abuja Elite Properties", listingsCount: 6 },
  { id: 3, name: "Emmanuel Adeyemi", title: "Commercial & Residential Broker", email: "emmanuel@phrealtors.ng", phone: "+234 802 987 6543", bio: "Emmanuel has been the go-to agent for Port Harcourt's oil and gas professionals since 2012.", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", agency: "PH Realtors & Co", listingsCount: 2 },
  { id: 4, name: "Fatima Abdullahi", title: "Northern Region Director", email: "fatima@kanoproperties.ng", phone: "+234 806 345 6789", bio: "Fatima leads property operations across Northern Nigeria from her Kano base.", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face", agency: "Kano Premium Properties", listingsCount: 2 },
  { id: 5, name: "Oluwaseun Ajayi", title: "Short Let & Airbnb Specialist", email: "seun@shortletlagos.ng", phone: "+234 701 876 5432", bio: "Seun pioneered the short-let revolution in Lagos, managing over 50 premium apartments.", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", agency: "Lagos Short Let Hub", listingsCount: 3 },
  { id: 6, name: "Ngozi Eze", title: "Land & Development Consultant", email: "ngozi@enugulands.ng", phone: "+234 809 123 4567", bio: "Ngozi specializes in land acquisition and development projects across the Southeast.", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face", agency: "Southeast Land Partners", listingsCount: 1 },
  { id: 7, name: "Ibrahim Suleiman", title: "Investment Property Advisor", email: "ibrahim@kadunainvest.ng", phone: "+234 703 567 8901", bio: "Ibrahim focuses on income-generating properties across Kaduna, Zaria, and Jos.", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face", agency: "Kaduna Investment Realty", listingsCount: 1 },
  { id: 8, name: "Adesua Ogunlesi", title: "Waterfront & Premium Estates", email: "adesua@waterfront.ng", phone: "+234 808 901 2345", bio: "Adesua curates the finest waterfront and gated estate properties in Lagos.", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face", agency: "Waterfront Estates Nigeria", listingsCount: 5 },
];

const PROPERTIES: Property[] = [
  {
    id: 1, title: "5-Bedroom Waterfront Mansion with Private Jetty",
    description: "An architectural masterpiece on Banana Island featuring 5 ensuite bedrooms, a private cinema, infinity pool, smart home automation, and a private jetty.",
    propertyType: "house", listingType: "sale", status: "active", price: 850000000,
    beds: 5, baths: 6.5, sqft: 8500, lotSize: 12900, yearBuilt: 2021,
    address: "25 Banana Island Road", city: "Banana Island", state: "Lagos", zip: "101233",
    latitude: 6.4615, longitude: 3.4728, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"],
    features: ["Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security","Boys Quarters (BQ)","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Balcony / Terrace","Borehole / Water Tank","Solar Power","Elevator/Lift","Smart Home System","Private Cinema","Wine Cellar"],
    agentId: 8, agent: AGENTS[7], videoUrl: null, createdAt: "2026-05-15T10:30:00Z"
  },
  {
    id: 2, title: "4-Bedroom Detached Duplex in Lekki Phase 1",
    description: "Stunning contemporary duplex on Admiralty Way with open-plan living, floor-to-ceiling windows, and a rooftop terrace.",
    propertyType: "house", listingType: "sale", status: "active", price: 280000000,
    beds: 4, baths: 4.5, sqft: 4200, lotSize: 6500, yearBuilt: 2019,
    address: "14 Admiralty Way", city: "Lekki Phase 1", state: "Lagos", zip: "106104",
    latitude: 6.4474, longitude: 3.4723, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80","https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80","https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80"],
    features: ["Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security","Boys Quarters (BQ)","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Borehole / Water Tank"],
    agentId: 1, agent: AGENTS[0], videoUrl: null, createdAt: "2026-04-20T14:15:00Z"
  },
  {
    id: 3, title: "3-Bedroom Penthouse with Panoramic Ocean Views",
    description: "Breathtaking penthouse on the 15th floor with 360-degree views of the Atlantic.",
    propertyType: "condo", listingType: "sale", status: "active", price: 450000000,
    beds: 3, baths: 3.5, sqft: 3200, lotSize: null, yearBuilt: 2022,
    address: "3 Eko Atlantic Avenue", city: "Eko Atlantic", state: "Lagos", zip: "101241",
    latitude: 6.4235, longitude: 3.4297, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&q=80","https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80","https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Balcony / Terrace","Gym / Fitness Centre","Elevator/Lift","Concierge Service","Ocean View"],
    agentId: 8, agent: AGENTS[7], videoUrl: null, createdAt: "2026-06-01T09:00:00Z"
  },
  {
    id: 4, title: "6-Bedroom Colonial Estate on 2 Acres",
    description: "A timeless colonial-style estate in Old Ikoyi featuring 6 bedrooms, a tennis court, swimming pool, and separate guest house.",
    propertyType: "house", listingType: "sale", status: "active", price: 1200000000,
    beds: 6, baths: 7, sqft: 12000, lotSize: 87120, yearBuilt: 1998,
    address: "8 Gerrard Road", city: "Ikoyi", state: "Lagos", zip: "101233",
    latitude: 6.4500, longitude: 3.4333, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"],
    features: ["Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security","Boys Quarters (BQ)","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Borehole / Water Tank","Solar Power","Tennis Court","Guest House"],
    agentId: 1, agent: AGENTS[0], videoUrl: null, createdAt: "2026-03-10T11:20:00Z"
  },
  {
    id: 5, title: "Modern 4-Bedroom Smart Home in Chevron Drive",
    description: "Cutting-edge smart home in the secure Chevron Estate with biometric access and automated lighting.",
    propertyType: "house", listingType: "sale", status: "active", price: 195000000,
    beds: 4, baths: 4, sqft: 3800, lotSize: 7200, yearBuilt: 2020,
    address: "17 Chevron Drive", city: "Lekki", state: "Lagos", zip: "106104",
    latitude: 6.4698, longitude: 3.5852, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80"],
    features: ["Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Borehole / Water Tank","Solar Power","Smart Home System"],
    agentId: 1, agent: AGENTS[0], videoUrl: null, createdAt: "2026-05-22T16:45:00Z"
  },
  {
    id: 6, title: "3-Bedroom Apartment in Victoria Island",
    description: "Elegant apartment in a secure VI complex with pool, gym, and backup power.",
    propertyType: "condo", listingType: "rent", status: "active", price: 8500000,
    beds: 3, baths: 3, sqft: 2100, lotSize: null, yearBuilt: 2018,
    address: "42 Ahmadu Bello Way", city: "Victoria Island", state: "Lagos", zip: "101241",
    latitude: 6.4281, longitude: 3.4219, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80","https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Gym / Fitness Centre","Elevator/Lift","Backup Power"],
    agentId: 1, agent: AGENTS[0], videoUrl: null, createdAt: "2026-04-05T08:30:00Z"
  },
  {
    id: 7, title: "2-Bedroom Flat in Lekki Phase 1",
    description: "Well-maintained 2-bedroom flat in a quiet Lekki Phase 1 street.",
    propertyType: "condo", listingType: "rent", status: "active", price: 4200000,
    beds: 2, baths: 2, sqft: 1200, lotSize: null, yearBuilt: 2016,
    address: "12 Ozumba Mbadiwe", city: "Victoria Island", state: "Lagos", zip: "101241",
    latitude: 6.4300, longitude: 3.4250, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Borehole / Water Tank"],
    agentId: 1, agent: AGENTS[0], videoUrl: null, createdAt: "2026-06-10T13:00:00Z"
  },
  {
    id: 8, title: "4-Bedroom Terrace Duplex in Osapa London",
    description: "Spacious terrace duplex in the fast-growing Osapa London area.",
    propertyType: "townhouse", listingType: "rent", status: "active", price: 5500000,
    beds: 4, baths: 3.5, sqft: 2800, lotSize: 3500, yearBuilt: 2019,
    address: "33 Prince Ademola Eletu", city: "Osapa London", state: "Lagos", zip: "106104",
    latitude: 6.4350, longitude: 3.4800, featured: false, verified: false,
    coverImage: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80","https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&q=80","https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace"],
    agentId: 1, agent: AGENTS[0], videoUrl: null, createdAt: "2026-05-28T10:15:00Z"
  },
  {
    id: 9, title: "Luxury 3-Bed Short Let in Oniru",
    description: "Instagram-worthy short-let apartment in Oniru with designer furniture and 24/7 power.",
    propertyType: "condo", listingType: "shortlet", status: "active", price: 95000,
    beds: 3, baths: 3, sqft: 1800, lotSize: null, yearBuilt: 2021,
    address: "55 Freedom Way", city: "Lekki Phase 1", state: "Lagos", zip: "106104",
    latitude: 6.4450, longitude: 3.4700, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80","https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80","https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Gym / Fitness Centre","Elevator/Lift","Concierge Service","Smart TV","Rooftop Pool"],
    agentId: 5, agent: AGENTS[4], videoUrl: null, createdAt: "2026-06-15T11:00:00Z"
  },
  {
    id: 10, title: "Cozy Studio Apartment in Lekki",
    description: "Beautifully furnished studio perfect for solo travelers or couples.",
    propertyType: "condo", listingType: "shortlet", status: "active", price: 35000,
    beds: 1, baths: 1, sqft: 550, lotSize: null, yearBuilt: 2020,
    address: "7 Parkview Estate Road", city: "Ikoyi", state: "Lagos", zip: "101233",
    latitude: 6.4520, longitude: 3.4350, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80","https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","Parking Space","Air Conditioning","Fitted Kitchen","Tiled Floors","Smart TV","Workspace"],
    agentId: 5, agent: AGENTS[4], videoUrl: null, createdAt: "2026-06-20T14:30:00Z"
  },
  {
    id: 11, title: "2-Bedroom Short Let in Parkview Estate",
    description: "Elegant short-let in prestigious Parkview Estate Ikoyi.",
    propertyType: "condo", listingType: "shortlet", status: "active", price: 75000,
    beds: 2, baths: 2, sqft: 1400, lotSize: null, yearBuilt: 2017,
    address: "7 Parkview Estate Road", city: "Ikoyi", state: "Lagos", zip: "101233",
    latitude: 6.4520, longitude: 3.4350, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80","https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Private Garden","Tennis Court"],
    agentId: 5, agent: AGENTS[4], videoUrl: null, createdAt: "2026-06-18T09:45:00Z"
  },
  {
    id: 12, title: "5-Bedroom Mansion in Maitama",
    description: "Palatial mansion in Abuja's most exclusive district with grand entrance hall and wine cellar.",
    propertyType: "house", listingType: "sale", status: "active", price: 650000000,
    beds: 5, baths: 6, sqft: 9000, lotSize: 18000, yearBuilt: 2019,
    address: "15 Maitama Close", city: "Maitama", state: "Abuja", zip: "900271",
    latitude: 9.0833, longitude: 7.5333, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"],
    features: ["Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security","Boys Quarters (BQ)","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Borehole / Water Tank","Solar Power","Wine Cellar","Home Office"],
    agentId: 2, agent: AGENTS[1], videoUrl: null, createdAt: "2026-04-12T10:00:00Z"
  },
  {
    id: 13, title: "4-Bedroom Duplex in Asokoro",
    description: "Executive duplex in the diplomatic zone of Asokoro with marble floors and rooftop terrace.",
    propertyType: "house", listingType: "sale", status: "active", price: 380000000,
    beds: 4, baths: 4.5, sqft: 5200, lotSize: 9500, yearBuilt: 2018,
    address: "8 Asokoro Crescent", city: "Asokoro", state: "Abuja", zip: "900231",
    latitude: 9.0500, longitude: 7.5167, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80"],
    features: ["Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security","Boys Quarters (BQ)","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Borehole / Water Tank","Home Cinema"],
    agentId: 2, agent: AGENTS[1], videoUrl: null, createdAt: "2026-05-08T15:30:00Z"
  },
  {
    id: 14, title: "3-Bedroom Apartment in Wuse 2",
    description: "Modern apartment in the heart of Wuse 2, close to shopping malls and restaurants.",
    propertyType: "condo", listingType: "sale", status: "active", price: 95000000,
    beds: 3, baths: 3, sqft: 1650, lotSize: null, yearBuilt: 2020,
    address: "22 Wuse Zone 2", city: "Wuse", state: "Abuja", zip: "900281",
    latitude: 9.0667, longitude: 7.4667, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80","https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Elevator/Lift"],
    agentId: 2, agent: AGENTS[1], videoUrl: null, createdAt: "2026-05-25T11:20:00Z"
  },
  {
    id: 15, title: "3-Bedroom Flat in Jabi",
    description: "Spacious flat in the vibrant Jabi district with POP ceilings and balcony views.",
    propertyType: "condo", listingType: "rent", status: "active", price: 3200000,
    beds: 3, baths: 3, sqft: 1500, lotSize: null, yearBuilt: 2019,
    address: "10 Jabi District", city: "Jabi", state: "Abuja", zip: "900211",
    latitude: 9.0333, longitude: 7.4167, featured: false, verified: false,
    coverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace"],
    agentId: 2, agent: AGENTS[1], videoUrl: null, createdAt: "2026-06-05T08:45:00Z"
  },
  {
    id: 16, title: "2-Bedroom Apartment in Guzape",
    description: "Newly built apartment in the up-and-coming Guzape Hills area with modern finishes.",
    propertyType: "condo", listingType: "rent", status: "active", price: 2800000,
    beds: 2, baths: 2, sqft: 1100, lotSize: null, yearBuilt: 2023,
    address: "5 Guzape Hills", city: "Guzape", state: "Abuja", zip: "900108",
    latitude: 9.0000, longitude: 7.5000, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80","https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&q=80","https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors"],
    agentId: 2, agent: AGENTS[1], videoUrl: null, createdAt: "2026-06-22T10:00:00Z"
  },
  {
    id: 17, title: "4-Bedroom Duplex in GRA Phase 2",
    description: "Executive duplex in Port Harcourt's premier residential area with swimming pool and BQ.",
    propertyType: "house", listingType: "sale", status: "active", price: 220000000,
    beds: 4, baths: 4.5, sqft: 4500, lotSize: 8000, yearBuilt: 2017,
    address: "18 GRA Phase 2", city: "Port Harcourt", state: "Rivers", zip: "500272",
    latitude: 4.8500, longitude: 7.0333, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"],
    features: ["Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security","Boys Quarters (BQ)","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Borehole / Water Tank","Double Garage"],
    agentId: 3, agent: AGENTS[2], videoUrl: null, createdAt: "2026-04-18T13:15:00Z"
  },
  {
    id: 18, title: "3-Bedroom Apartment for Rent in Trans Amadi",
    description: "Well-finished apartment in the industrial hub of Port Harcourt with 24/7 power.",
    propertyType: "condo", listingType: "rent", status: "active", price: 4500000,
    beds: 3, baths: 3, sqft: 1600, lotSize: null, yearBuilt: 2019,
    address: "7 Trans Amadi Layout", city: "Port Harcourt", state: "Rivers", zip: "500102",
    latitude: 4.8333, longitude: 7.0500, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80","https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80","https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","24/7 Power"],
    agentId: 3, agent: AGENTS[2], videoUrl: null, createdAt: "2026-05-30T09:30:00Z"
  },
  {
    id: 19, title: "5-Bedroom Mansion in Bompai",
    description: "Grand mansion in Kano's most prestigious neighborhood with traditional Hausa architecture.",
    propertyType: "house", listingType: "sale", status: "active", price: 180000000,
    beds: 5, baths: 5, sqft: 6800, lotSize: 15000, yearBuilt: 2016,
    address: "12 Bompai Road", city: "Kano", state: "Kano", zip: "700231",
    latitude: 12.0000, longitude: 8.5167, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80","https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80"],
    features: ["Swimming Pool","Generator / Inverter","Gated Estate","24/7 Security","Boys Quarters (BQ)","CCTV Surveillance","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Courtyard","Traditional Architecture"],
    agentId: 4, agent: AGENTS[3], videoUrl: null, createdAt: "2026-04-25T11:00:00Z"
  },
  {
    id: 20, title: "3-Bedroom Flat in Nasarawa GRA",
    description: "Well-maintained flat in the serene Nasarawa GRA with fitted wardrobes and POP ceilings.",
    propertyType: "condo", listingType: "rent", status: "active", price: 1800000,
    beds: 3, baths: 2, sqft: 1300, lotSize: null, yearBuilt: 2018,
    address: "5 Nasarawa GRA", city: "Kano", state: "Kano", zip: "700241",
    latitude: 11.9833, longitude: 8.5333, featured: false, verified: false,
    coverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"],
    features: ["Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace"],
    agentId: 4, agent: AGENTS[3], videoUrl: null, createdAt: "2026-06-12T14:00:00Z"
  },
  {
    id: 21, title: "4-Bedroom Duplex in Independence Layout",
    description: "Elegant duplex in Enugu's most sought-after neighborhood with modern kitchen and garden.",
    propertyType: "house", listingType: "sale", status: "active", price: 85000000,
    beds: 4, baths: 4, sqft: 3500, lotSize: 6000, yearBuilt: 2017,
    address: "9 Independence Layout", city: "Enugu", state: "Enugu", zip: "400271",
    latitude: 6.4500, longitude: 7.5167, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80","https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80","https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80"],
    features: ["Generator / Inverter","Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Balcony / Terrace","Garden"],
    agentId: 6, agent: AGENTS[5], videoUrl: null, createdAt: "2026-05-18T10:30:00Z"
  },
  {
    id: 22, title: "3-Bedroom Bungalow in Barnawa",
    description: "Charming bungalow in the family-friendly Barnawa area with fruit trees and BQ.",
    propertyType: "house", listingType: "sale", status: "active", price: 45000000,
    beds: 3, baths: 2.5, sqft: 2100, lotSize: 7200, yearBuilt: 2015,
    address: "14 Barnawa Close", city: "Kaduna", state: "Kaduna", zip: "800271",
    latitude: 10.5167, longitude: 7.4333, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80","https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&q=80","https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80"],
    features: ["Generator / Inverter","Gated Estate","24/7 Security","Parking Space","Air Conditioning","Ensuite Bedrooms","Fitted Kitchen","Tiled Floors","Garden","Fruit Trees"],
    agentId: 7, agent: AGENTS[6], videoUrl: null, createdAt: "2026-05-05T09:00:00Z"
  },
  {
    id: 23, title: "1,000 Sqm Land in Eko Atlantic",
    description: "Prime waterfront land in Africa's most ambitious city development with direct ocean access.",
    propertyType: "land", listingType: "sale", status: "active", price: 1200000000,
    beds: 0, baths: 0, sqft: 10764, lotSize: 10764, yearBuilt: null,
    address: "3 Eko Atlantic Avenue", city: "Eko Atlantic", state: "Lagos", zip: "101241",
    latitude: 6.4235, longitude: 3.4297, featured: true, verified: true,
    coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80","https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80","https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"],
    features: ["Waterfront","Beach Access","Commercial Zone","Road Access","Utilities Available"],
    agentId: 8, agent: AGENTS[7], videoUrl: null, createdAt: "2026-03-20T08:00:00Z"
  },
  {
    id: 24, title: "5,000 Sqm Land in Guzape Hills",
    description: "Expansive land parcel in Abuja's fastest-growing district with panoramic city views.",
    propertyType: "land", listingType: "sale", status: "active", price: 350000000,
    beds: 0, baths: 0, sqft: 53820, lotSize: 53820, yearBuilt: null,
    address: "5 Guzape Hills", city: "Guzape", state: "Abuja", zip: "900108",
    latitude: 9.0000, longitude: 7.5000, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80","https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80","https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80"],
    features: ["Hilltop View","Road Access","Electricity Available","Panoramic Views","Suitable for Development"],
    agentId: 2, agent: AGENTS[1], videoUrl: null, createdAt: "2026-04-01T10:00:00Z"
  },
  {
    id: 25, title: "2,000 Sqm Land in Lekki Free Trade Zone",
    description: "Strategic land in the Lekki Free Trade Zone, perfect for industrial or commercial development.",
    propertyType: "land", listingType: "sale", status: "active", price: 280000000,
    beds: 0, baths: 0, sqft: 21528, lotSize: 21528, yearBuilt: null,
    address: "17 Chevron Drive", city: "Lekki", state: "Lagos", zip: "106104",
    latitude: 6.4698, longitude: 3.5852, featured: false, verified: true,
    coverImage: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80","https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80","https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80"],
    features: ["Free Trade Zone","Industrial Area","Road Access","Utilities Available","Near Deep Sea Port"],
    agentId: 1, agent: AGENTS[0], videoUrl: null, createdAt: "2026-03-15T11:30:00Z"
  },
];

const CITIES: CityData[] = [
  { city: "Lagos", count: 13, coverImage: "https://images.unsplash.com/photo-1616486028091-628d0959f6d4?w=800&q=80" },
  { city: "Abuja", count: 6, coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" },
  { city: "Port Harcourt", count: 2, coverImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80" },
  { city: "Kano", count: 2, coverImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" },
  { city: "Enugu", count: 1, coverImage: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80" },
  { city: "Kaduna", count: 1, coverImage: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80" },
];

const MARKET_STATS: MarketStats = {
  totalListings: 25,
  avgSalePrice: 312000000,
  cityCount: 6,
  agentCount: 8,
};

const HOME_STATS: HomeStats = {
  listingCount: 25,
  agentCount: 8,
  cityCount: 6,
};

// ─── Helper Functions ───────────────────────────────────────

function filterProperties(params: {
  q?: string;
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  sort?: string;
}): Property[] {
  let result = [...PROPERTIES];

  if (params.q) {
    const q = params.q.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q)
    );
  }

  if (params.city) {
    result = result.filter(p => p.city.toLowerCase() === params.city!.toLowerCase());
  }

  if (params.propertyType && params.propertyType !== "all") {
    result = result.filter(p => p.propertyType === params.propertyType);
  }

  if (params.listingType && params.listingType !== "all") {
    result = result.filter(p => p.listingType === params.listingType);
  }

  if (params.minPrice) {
    result = result.filter(p => p.price >= params.minPrice!);
  }

  if (params.maxPrice) {
    result = result.filter(p => p.price <= params.maxPrice!);
  }

  if (params.minBeds) {
    result = result.filter(p => p.beds >= params.minBeds!);
  }

  // Sorting
  if (params.sort === "price_asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (params.sort === "price_desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (params.sort === "beds_desc") {
    result.sort((a, b) => b.beds - a.beds);
  } else if (params.sort === "sqft_desc") {
    result.sort((a, b) => b.sqft - a.sqft);
  } else {
    // newest (default)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}

// ─── React Query Hooks ──────────────────────────────────────

export function useListProperties(params: any = {}) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => {
      return Promise.resolve(filterProperties(params));
    },
  });
}

export function useGetProperty(id: number) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => {
      const property = PROPERTIES.find(p => p.id === id);
      return Promise.resolve(property || null);
    },
    enabled: !!id,
  });
}

export function useListFeaturedProperties() {
  return useQuery({
    queryKey: ["featured-properties"],
    queryFn: () => {
      return Promise.resolve(PROPERTIES.filter(p => p.featured));
    },
  });
}

export function useListSimilarProperties(id: number) {
  return useQuery({
    queryKey: ["similar-properties", id],
    queryFn: () => {
      const property = PROPERTIES.find(p => p.id === id);
      if (!property) return Promise.resolve([]);
      const similar = PROPERTIES.filter(p =>
        p.id !== id &&
        p.city === property.city &&
        p.listingType === property.listingType
      ).slice(0, 4);
      return Promise.resolve(similar);
    },
    enabled: !!id,
  });
}

export function useListAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: () => Promise.resolve(AGENTS),
  });
}

export function useGetAgent(id: number) {
  return useQuery({
    queryKey: ["agent", id],
    queryFn: () => {
      const agent = AGENTS.find(a => a.id === id);
      return Promise.resolve(agent || null);
    },
    enabled: !!id,
  });
}

export function useListCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: () => Promise.resolve(CITIES),
  });
}

export function useGetMarketStats() {
  return useQuery({
    queryKey: ["market-stats"],
    queryFn: () => Promise.resolve(MARKET_STATS),
  });
}

export function useGetHomeStats() {
  return useQuery({
    queryKey: ["home-stats"],
    queryFn: () => Promise.resolve(HOME_STATS),
  });
}

// ─── Mutations ──────────────────────────────────────────────

export function useCreateInquiry() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      console.log("Inquiry created:", data);
      return Promise.resolve({ id: Math.floor(Math.random() * 1000), ...data });
    },
  });
}

export function useBookInspection() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      console.log("Inspection booked:", data);
      return Promise.resolve({ id: Math.floor(Math.random() * 1000), ...data });
    },
  });
}

export function useSubmitProperty() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      console.log("Property submitted:", data);
      return Promise.resolve({ id: Math.floor(Math.random() * 1000) + 100, ...data });
    },
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const favorites = JSON.parse(localStorage.getItem("baytna_favorites") || "[]");
      if (!favorites.includes(data.propertyId)) {
        favorites.push(data.propertyId);
        localStorage.setItem("baytna_favorites", JSON.stringify(favorites));
      }
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const favorites = JSON.parse(localStorage.getItem("baytna_favorites") || "[]");
      const updated = favorites.filter((id: number) => id !== data.propertyId);
      localStorage.setItem("baytna_favorites", JSON.stringify(updated));
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useListFavorites(params: { sessionId: string }) {
  return useQuery({
    queryKey: ["favorites", params.sessionId],
    queryFn: () => {
      const favoriteIds = JSON.parse(localStorage.getItem("baytna_favorites") || "[]");
      const favorites = PROPERTIES.filter(p => favoriteIds.includes(p.id));
      return Promise.resolve(favorites);
    },
    enabled: !!params.sessionId,
  });
}

export function useRequestUploadUrl() {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      // Mock upload URL
      return Promise.resolve({
        uploadURL: "https://httpbin.org/put",
        objectPath: `/uploads/${Date.now()}-${data.name}`,
      });
    },
  });
}

export function useUpdatePropertyVideo() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      console.log("Video updated for property", id, data);
      return Promise.resolve({ success: true });
    },
  });
}

// ─── Query Keys (for compatibility) ───────────────────────

export function getListPropertiesQueryKey(params?: any) {
  return ["properties", params];
}

export function getListFeaturedPropertiesQueryKey() {
  return ["featured-properties"];
}

export function getGetPropertyQueryKey(id: number) {
  return ["property", id];
}

export function getListSimilarPropertiesQueryKey(id: number) {
  return ["similar-properties", id];
}

export function getListAgentsQueryKey() {
  return ["agents"];
}

export function getGetAgentQueryKey(id: number) {
  return ["agent", id];
}

export function getListCitiesQueryKey() {
  return ["cities"];
}

export function getGetMarketStatsQueryKey() {
  return ["market-stats"];
}

export function getGetHomeStatsQueryKey() {
  return ["home-stats"];
}

export function getListFavoritesQueryKey(params: { sessionId: string }) {
  return ["favorites", params.sessionId];
}

// Re-export types for compatibility
export type ListPropertiesPropertyType = "house" | "condo" | "townhouse" | "loft" | "land";
export type ListPropertiesListingType = "sale" | "rent" | "shortlet";
export type ListPropertiesSort = "newest" | "price_asc" | "price_desc" | "beds_desc" | "sqft_desc";

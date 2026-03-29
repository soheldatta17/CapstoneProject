// Mock data for admin portal

export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  venueId: string;
  organizer: string;
  capacity: number;
  attendees: number;
  status: "draft" | "published" | "completed" | "cancelled";
  budget: number;
  spent: number;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  amenities: string[];
  hourlyRate: number;
  status: "active" | "inactive";
  imageUrl: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  eventId: string;
  eventName: string;
  status: "registered" | "confirmed" | "checked_in" | "cancelled";
  ticketType: "standard" | "vip" | "premium";
  registeredAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: "catering" | "decoration" | "photography" | "audio" | "lighting" | "florist" | "transport";
  contactEmail: string;
  phone: string;
  rating: number;
  eventsAssigned: number;
}

export interface Expense {
  id: string;
  eventId: string;
  eventName: string;
  category: "venue" | "catering" | "decoration" | "marketing" | "staff" | "equipment" | "other";
  description: string;
  amount: number;
  vendorName?: string;
  date: string;
}

export interface Booking {
  id: string;
  eventName: string;
  userName: string;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled";
  totalAmount: number;
}

export const mockEvents: Event[] = [
  { id: "1", title: "Tech Summit 2026", description: "Annual technology conference", eventDate: "2026-03-28", startTime: "09:00", endTime: "18:00", venue: "Grand Convention Hall", venueId: "1", organizer: "Sohel Ahmed", capacity: 500, attendees: 342, status: "published", budget: 50000, spent: 42000 },
  { id: "2", title: "Spring Gala", description: "Annual charity fundraiser", eventDate: "2026-04-05", startTime: "19:00", endTime: "23:00", venue: "Riverside Ballroom", venueId: "2", organizer: "Sohel Ahmed", capacity: 200, attendees: 178, status: "published", budget: 30000, spent: 24500 },
  { id: "3", title: "Product Launch — Zenith", description: "New product reveal event", eventDate: "2026-04-12", startTime: "14:00", endTime: "17:00", venue: "Innovation Hub", venueId: "3", organizer: "Sohel Ahmed", capacity: 150, attendees: 0, status: "draft", budget: 20000, spent: 5000 },
  { id: "4", title: "Music Festival", description: "Two-day outdoor music event", eventDate: "2026-05-01", startTime: "12:00", endTime: "22:00", venue: "Central Park Amphitheatre", venueId: "4", organizer: "Sohel Ahmed", capacity: 1000, attendees: 867, status: "published", budget: 80000, spent: 65000 },
  { id: "5", title: "Corporate Workshop", description: "Leadership training workshop", eventDate: "2026-03-20", startTime: "10:00", endTime: "16:00", venue: "Business Center", venueId: "5", organizer: "Sohel Ahmed", capacity: 50, attendees: 48, status: "completed", budget: 8000, spent: 7200 },
  { id: "6", title: "Art Exhibition", description: "Modern art showcase", eventDate: "2026-06-15", startTime: "11:00", endTime: "20:00", venue: "Gallery West", venueId: "6", organizer: "Sohel Ahmed", capacity: 300, attendees: 0, status: "draft", budget: 15000, spent: 2000 },
];

export const mockVenues: Venue[] = [
  { id: "1", name: "Grand Convention Hall", address: "123 Main St", city: "Mumbai", capacity: 500, amenities: ["WiFi", "Projector", "Sound System", "Parking", "Catering Kitchen"], hourlyRate: 500, status: "active", imageUrl: "" },
  { id: "2", name: "Riverside Ballroom", address: "456 River Rd", city: "Delhi", capacity: 200, amenities: ["WiFi", "Stage", "Sound System", "Valet Parking"], hourlyRate: 350, status: "active", imageUrl: "" },
  { id: "3", name: "Innovation Hub", address: "789 Tech Blvd", city: "Bangalore", capacity: 150, amenities: ["WiFi", "4K Displays", "Whiteboard", "Coffee Bar"], hourlyRate: 250, status: "active", imageUrl: "" },
  { id: "4", name: "Central Park Amphitheatre", address: "101 Park Ave", city: "Pune", capacity: 1000, amenities: ["Open Air", "Stage", "Sound System", "Food Courts"], hourlyRate: 800, status: "active", imageUrl: "" },
  { id: "5", name: "Business Center", address: "202 Corp Dr", city: "Hyderabad", capacity: 50, amenities: ["WiFi", "Projector", "Conference Phone", "Whiteboard"], hourlyRate: 120, status: "active", imageUrl: "" },
  { id: "6", name: "Gallery West", address: "303 Art Lane", city: "Mumbai", capacity: 300, amenities: ["WiFi", "Lighting Rigs", "Open Floor", "Security"], hourlyRate: 400, status: "inactive", imageUrl: "" },
];

export const mockAttendees: Attendee[] = [
  { id: "1", name: "Rahul Sharma", email: "rahul@example.com", eventId: "1", eventName: "Tech Summit 2026", status: "checked_in", ticketType: "vip", registeredAt: "2026-02-15" },
  { id: "2", name: "Priya Patel", email: "priya@example.com", eventId: "1", eventName: "Tech Summit 2026", status: "confirmed", ticketType: "standard", registeredAt: "2026-02-18" },
  { id: "3", name: "Amit Kumar", email: "amit@example.com", eventId: "2", eventName: "Spring Gala", status: "registered", ticketType: "premium", registeredAt: "2026-03-01" },
  { id: "4", name: "Sneha Reddy", email: "sneha@example.com", eventId: "1", eventName: "Tech Summit 2026", status: "cancelled", ticketType: "standard", registeredAt: "2026-02-20" },
  { id: "5", name: "Vikram Singh", email: "vikram@example.com", eventId: "4", eventName: "Music Festival", status: "confirmed", ticketType: "vip", registeredAt: "2026-03-10" },
  { id: "6", name: "Ananya Iyer", email: "ananya@example.com", eventId: "2", eventName: "Spring Gala", status: "checked_in", ticketType: "standard", registeredAt: "2026-03-05" },
  { id: "7", name: "Karan Mehta", email: "karan@example.com", eventId: "5", eventName: "Corporate Workshop", status: "checked_in", ticketType: "standard", registeredAt: "2026-03-12" },
  { id: "8", name: "Deepika Nair", email: "deepika@example.com", eventId: "4", eventName: "Music Festival", status: "registered", ticketType: "premium", registeredAt: "2026-03-14" },
];

export const mockVendors: Vendor[] = [
  { id: "1", name: "Pinnacle Catering", category: "catering", contactEmail: "info@pinnacle.com", phone: "+91 98765 43210", rating: 4.8, eventsAssigned: 12 },
  { id: "2", name: "LuxDecor Studio", category: "decoration", contactEmail: "hello@luxdecor.com", phone: "+91 98765 43211", rating: 4.6, eventsAssigned: 8 },
  { id: "3", name: "ShutterPro Media", category: "photography", contactEmail: "book@shutterpro.com", phone: "+91 98765 43212", rating: 4.9, eventsAssigned: 15 },
  { id: "4", name: "SoundWave Audio", category: "audio", contactEmail: "contact@soundwave.com", phone: "+91 98765 43213", rating: 4.7, eventsAssigned: 10 },
  { id: "5", name: "FlowerCraft", category: "florist", contactEmail: "orders@flowercraft.com", phone: "+91 98765 43214", rating: 4.5, eventsAssigned: 6 },
  { id: "6", name: "BrightLights Co.", category: "lighting", contactEmail: "info@brightlights.com", phone: "+91 98765 43215", rating: 4.4, eventsAssigned: 9 },
];

export const mockExpenses: Expense[] = [
  { id: "1", eventId: "1", eventName: "Tech Summit 2026", category: "venue", description: "Venue rental - 2 days", amount: 12000, date: "2026-02-01" },
  { id: "2", eventId: "1", eventName: "Tech Summit 2026", category: "catering", description: "Full-day catering for 500", amount: 15000, vendorName: "Pinnacle Catering", date: "2026-02-15" },
  { id: "3", eventId: "1", eventName: "Tech Summit 2026", category: "equipment", description: "AV equipment rental", amount: 8000, vendorName: "SoundWave Audio", date: "2026-03-01" },
  { id: "4", eventId: "1", eventName: "Tech Summit 2026", category: "marketing", description: "Social media campaign", amount: 5000, date: "2026-02-10" },
  { id: "5", eventId: "2", eventName: "Spring Gala", category: "decoration", description: "Floral arrangements", amount: 6000, vendorName: "FlowerCraft", date: "2026-03-10" },
  { id: "6", eventId: "2", eventName: "Spring Gala", category: "catering", description: "Dinner service for 200", amount: 10000, vendorName: "Pinnacle Catering", date: "2026-03-12" },
  { id: "7", eventId: "4", eventName: "Music Festival", category: "equipment", description: "Stage & sound setup", amount: 25000, vendorName: "SoundWave Audio", date: "2026-04-01" },
  { id: "8", eventId: "4", eventName: "Music Festival", category: "staff", description: "Security personnel", amount: 12000, date: "2026-04-10" },
];

export const mockBookings: Booking[] = [
  { id: "1", eventName: "Tech Summit 2026", userName: "Rahul Sharma", bookingDate: "2026-02-15", status: "confirmed", totalAmount: 299 },
  { id: "2", eventName: "Spring Gala", userName: "Priya Patel", bookingDate: "2026-03-01", status: "confirmed", totalAmount: 499 },
  { id: "3", eventName: "Music Festival", userName: "Vikram Singh", bookingDate: "2026-03-10", status: "pending", totalAmount: 199 },
  { id: "4", eventName: "Tech Summit 2026", userName: "Sneha Reddy", bookingDate: "2026-02-20", status: "cancelled", totalAmount: 299 },
  { id: "5", eventName: "Music Festival", userName: "Deepika Nair", bookingDate: "2026-03-14", status: "confirmed", totalAmount: 399 },
];

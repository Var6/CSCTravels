export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type VehicleKind = 'car' | 'bus' | 'traveler';
export type TripKind = 'one_way' | 'round_trip' | 'outstation' | 'hourly';

export interface Booking {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  pickup: string;
  drop_location: string;
  pickup_at: string;
  return_at: string | null;
  vehicle_type: VehicleKind;
  trip_type: TripKind;
  passengers: number;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export interface BookingInput {
  customer_name: string;
  phone: string;
  email?: string;
  pickup: string;
  drop_location: string;
  pickup_at: string;
  return_at?: string;
  vehicle_type: VehicleKind;
  trip_type: TripKind;
  passengers: number;
  notes?: string;
}

export const VEHICLE_LABEL: Record<VehicleKind, string> = {
  car: 'Car (4+1 seater)',
  bus: 'Bus / Coach (20-50 seater)',
  traveler: 'Traveler (8-14 seater)',
};

export const TRIP_LABEL: Record<TripKind, string> = {
  one_way: 'One-way',
  round_trip: 'Round trip',
  outstation: 'Outstation',
  hourly: 'Hourly (8 hr package)',
};

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

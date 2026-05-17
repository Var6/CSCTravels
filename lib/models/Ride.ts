import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ILocation {
  address: string
  lat: number
  lng: number
}

export interface IRide extends Document {
  userId: mongoose.Types.ObjectId
  driverId?: mongoose.Types.ObjectId
  pickup: ILocation
  dropoff: ILocation
  vehicleType: 'bike' | 'auto' | 'cab' | 'suv' | 'bus'
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  fare?: number
  distance?: number   // km
  duration?: number   // minutes
  otp: string
  cancelReason?: string
  rating?: number
  feedback?: string
  paymentMode: 'cash' | 'online'
  paymentStatus: 'pending' | 'paid'
  scheduledAt?: Date
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const LocationSchema = new Schema<ILocation>(
  {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
)

const RideSchema = new Schema<IRide>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    pickup: { type: LocationSchema, required: true },
    dropoff: { type: LocationSchema, required: true },
    vehicleType: {
      type: String,
      enum: ['bike', 'auto', 'cab', 'suv', 'bus'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    fare: { type: Number },
    distance: { type: Number },
    duration: { type: Number },
    otp: { type: String, required: true },
    cancelReason: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    paymentMode: { type: String, enum: ['cash', 'online'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    scheduledAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
)

// Fare rates per km (in ₹)
export const FARE_RATES: Record<string, { base: number; perKm: number }> = {
  bike: { base: 20, perKm: 7 },
  auto: { base: 30, perKm: 12 },
  cab: { base: 50, perKm: 18 },
  suv: { base: 80, perKm: 25 },
  bus: { base: 200, perKm: 10 },
}

export function calculateFare(vehicleType: string, distanceKm: number): number {
  const rate = FARE_RATES[vehicleType] ?? FARE_RATES.cab
  return Math.round(rate.base + rate.perKm * distanceKm)
}

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const Ride: Model<IRide> = mongoose.models.Ride || mongoose.model<IRide>('Ride', RideSchema)
export default Ride

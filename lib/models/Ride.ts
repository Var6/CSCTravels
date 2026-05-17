import mongoose, { Document, Model, Schema } from 'mongoose'
import { calculateFare } from '@/lib/fareUtils'
import type { FareBreakdown, TripType } from '@/lib/fareUtils'
export { calculateFare }

export interface ILocation {
  address: string
  lat: number
  lng: number
}

export interface IRide extends Document {
  userId:        mongoose.Types.ObjectId
  driverId?:     mongoose.Types.ObjectId
  pickup:        ILocation
  dropoff:       ILocation
  vehicleType:   'cab'
  tripType:      TripType
  status:        'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
  fare:          number
  fareBreakdown: FareBreakdown
  distance:      number    // one-way km
  duration:      number    // minutes
  otp:           string
  cancelReason?: string
  rating?:       number
  feedback?:     string
  paymentMode:   'cash' | 'online'
  paymentStatus: 'pending' | 'paid'
  scheduledAt?:  Date
  startedAt?:    Date
  completedAt?:  Date
  createdAt:     Date
  updatedAt:     Date
}

const LocationSchema = new Schema<ILocation>(
  { address: { type: String, required: true }, lat: { type: Number, required: true }, lng: { type: Number, required: true } },
  { _id: false }
)

const FareBreakdownSchema = new Schema<FareBreakdown>(
  {
    tripType:   { type: String, enum: ['one_way', 'round_trip'], required: true },
    oneWayKm:   { type: Number, required: true },
    chargedKm:  { type: Number, required: true },
    ratePerKm:  { type: Number, required: true },
    baseFare:   { type: Number, required: true },
    fuelCharge: { type: Number, default: 0 },
    totalFare:  { type: Number, required: true },
  },
  { _id: false }
)

const RideSchema = new Schema<IRide>(
  {
    userId:    { type: Schema.Types.ObjectId, ref: 'User',   required: true },
    driverId:  { type: Schema.Types.ObjectId, ref: 'Driver' },
    pickup:    { type: LocationSchema, required: true },
    dropoff:   { type: LocationSchema, required: true },
    vehicleType: { type: String, enum: ['cab'], default: 'cab' },
    tripType:    { type: String, enum: ['one_way', 'round_trip'], default: 'one_way' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    fare:          { type: Number, required: true },
    fareBreakdown: { type: FareBreakdownSchema, required: true },
    distance:      { type: Number, required: true },
    duration:      { type: Number, required: true },
    otp:           { type: String, required: true },
    cancelReason:  { type: String },
    rating:        { type: Number, min: 1, max: 5 },
    feedback:      { type: String },
    paymentMode:   { type: String, enum: ['cash', 'online'], default: 'cash' },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    scheduledAt:   { type: Date },
    startedAt:     { type: Date },
    completedAt:   { type: Date },
  },
  { timestamps: true }
)

export function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

const Ride: Model<IRide> = mongoose.models.Ride || mongoose.model<IRide>('Ride', RideSchema)
export default Ride

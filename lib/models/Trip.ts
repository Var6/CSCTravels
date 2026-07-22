// MIRROR of CSCBilling/models/Trip.ts (must stay in sync; both apps reach the
// same MongoDB `trips` collection).
import mongoose, { Schema, model, models, type Model } from 'mongoose'
import { geoPoint } from './geo'

export type TripStatus = 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled'
export type PayMethod  = 'cash' | 'upi' | 'card' | 'wallet'
export type PayStatus  = 'pending' | 'paid'

export interface ITrip {
  _id?: mongoose.Types.ObjectId
  companyId: mongoose.Types.ObjectId
  tripNumber?: string

  customer: { id: mongoose.Types.ObjectId; name: string; phone: string }
  driver:   { driverId?: mongoose.Types.ObjectId; name?: string; phone?: string }
  vehicle:  { vehicleId?: mongoose.Types.ObjectId; plate?: string; model?: string; company?: string }

  route: {
    pickup: string; dropoff: string
    /** GeoJSON [lng, lat]. Required for the ride to enter driver dispatch. */
    pickupPoint?: { type: 'Point'; coordinates: [number, number] }
    dropPoint?:   { type: 'Point'; coordinates: [number, number] }
    estimatedKm?: number
  }
  source?: 'app' | 'offline' | 'staff' | 'web'
  dispatch?: {
    offeredTo?: mongoose.Types.ObjectId[]
    offerWave?: number
    offerExpiresAt?: Date | null
    declinedBy?: mongoose.Types.ObjectId[]
    acceptedAt?: Date | null
  }
  pricing?: {
    tripKind?: string
    riderTier?: 'public' | 'member' | 'official'
    rateVersion?: string
    estimatedFare?: number
  }
  timing:   { tripDate: Date; startTime: string; endTime?: string }
  odometer: { start?: number; end?: number; totalKm?: number }

  charges: {
    costPerKm: number
    distanceCost: number
    waitingMinutes: number
    waitingCost: number
    additionalServices: Array<{ id?: string; name?: string; price?: number }>
    subtotal: number
    tax: number
    discount: number
    totalFare: number
  }

  payment: { method: PayMethod; status: PayStatus; referenceId?: string }
  status:  TripStatus
  otp?:    string                       // shared between customer + driver to confirm pickup
  notes?:  string
  /** Which engine produced the billed distance: google, osrm or a straight line. */
  distanceSource?: 'routes_api' | 'directions_legacy' | 'osrm' | 'haversine'
  distanceKm?: number
  createdAt: Date
  updatedAt: Date
}

const TripSchema = new Schema<ITrip>(
  {
    companyId:  { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    tripNumber: { type: String, unique: true, sparse: true },

    customer: {
      id:    { type: Schema.Types.ObjectId, required: true, ref: 'Customer' },
      name:  { type: String, required: true },
      phone: { type: String, required: true },
    },

    // Optional until status leaves "pending" — enforced in pre("save").
    driver: {
      driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
      name:     { type: String },
      phone:    { type: String },
    },
    vehicle: {
      vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
      plate:     { type: String },
      model:     { type: String },
      company:   { type: String, default: '' },
    },

    route: {
      pickup:  { type: String, required: true },
      dropoff: { type: String, required: true },
      // Coordinates are what let a web booking reach a driver. Without them the
      // trip is created but never enters dispatch and staff must assign it.
      pickupPoint: geoPoint(),
      dropPoint:   geoPoint(),
      estimatedKm: { type: Number, default: 0 },
    },

    // Where the booking came from. "web" is this site.
    source: {
      type: String,
      enum: ['app', 'offline', 'staff', 'web'],
      default: 'web',
    },

    /*
     * Provenance of the billed distance. Google and OSRM disagree by enough
     * to matter on a per-km fare, so a ride must record which one priced it.
     */
    distanceSource: {
      type: String,
      enum: ['routes_api', 'directions_legacy', 'osrm', 'haversine'],
      default: null,
    },
    distanceKm: { type: Number, default: null },

    // Nearest-driver-first dispatch state — see lib/dispatch.ts.
    dispatch: {
      offeredTo:      [{ type: Schema.Types.ObjectId, ref: 'Driver' }],
      offerWave:      { type: Number, default: 0 },
      offerExpiresAt: { type: Date, default: null },
      declinedBy:     [{ type: Schema.Types.ObjectId, ref: 'Driver' }],
      acceptedAt:     { type: Date, default: null },
    },

    // Pricing context, so a bill can be traced to the rate card that made it.
    pricing: {
      tripKind:      { type: String },
      riderTier:     { type: String, enum: ['public', 'member', 'official'], default: 'public' },
      rateVersion:   { type: String },
      estimatedFare: { type: Number, default: 0 },
    },
    timing: {
      tripDate:  { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime:   String,
    },
    odometer: {
      start:   { type: Number },
      end:     Number,
      totalKm: Number,
    },

    charges: {
      costPerKm:      { type: Number, default: 20 },
      distanceCost:   { type: Number, default: 0 },
      waitingMinutes: { type: Number, default: 0 },
      waitingCost:    { type: Number, default: 0 },
      additionalServices: [{ id: String, name: String, price: Number }],
      subtotal:  { type: Number, default: 0 },
      tax:       { type: Number, default: 0 },
      discount:  { type: Number, default: 0 },
      totalFare: { type: Number, required: true },
    },

    payment: {
      method: { type: String, enum: ['cash', 'upi', 'card', 'wallet'], default: 'cash' },
      status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
      referenceId: String,
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    otp:   { type: String },
    notes: String,
  },
  { timestamps: true }
)

TripSchema.pre('save', async function () {
  if (!this.tripNumber) {
    const count = await mongoose.model('Trip').countDocuments()
    this.tripNumber = `TRIP-${String(count + 1).padStart(6, '0')}`
  }

  const dispatched = this.status === 'ongoing' || this.status === 'completed'
  if (!dispatched) return

  const missing: string[] = []
  if (!this.driver?.driverId)   missing.push('driver.driverId')
  if (!this.driver?.name)       missing.push('driver.name')
  if (!this.driver?.phone)      missing.push('driver.phone')
  if (!this.vehicle?.vehicleId) missing.push('vehicle.vehicleId')
  if (!this.vehicle?.plate)     missing.push('vehicle.plate')
  if (!this.vehicle?.model)     missing.push('vehicle.model')
  if (this.odometer?.start == null) missing.push('odometer.start')
  if (missing.length) {
    throw new Error(`Trip cannot be ${this.status} without dispatch info — missing: ${missing.join(', ')}`)
  }
})

const Trip: Model<ITrip> =
  (models.Trip as Model<ITrip>) || model<ITrip>('Trip', TripSchema)

export default Trip

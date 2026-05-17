import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IDriverLocation {
  type: 'Point'
  coordinates: [number, number] // [longitude, latitude]
  updatedAt: Date
}

export interface IDriver extends Document {
  userId: mongoose.Types.ObjectId
  vehicleType: 'bike' | 'auto' | 'cab' | 'suv' | 'bus'
  vehicleNumber: string
  vehicleModel: string
  licenseNumber: string
  isAvailable: boolean
  isApproved: boolean
  rating: number
  totalRides: number
  location: IDriverLocation
  createdAt: Date
  updatedAt: Date
}

const DriverSchema = new Schema<IDriver>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    vehicleType: {
      type: String,
      enum: ['bike', 'auto', 'cab', 'suv', 'bus'],
      required: true,
    },
    vehicleNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    vehicleModel: { type: String, required: true, trim: true },
    licenseNumber: { type: String, required: true, unique: true, trim: true },
    isAvailable: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRides: { type: Number, default: 0 },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number], default: [85.1376, 25.5941] }, // Default: Patna
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
)

DriverSchema.index({ location: '2dsphere' })

const Driver: Model<IDriver> = mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema)
export default Driver

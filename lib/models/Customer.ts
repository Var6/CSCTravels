// MIRROR of CSCBilling/models/Customer.ts (must stay in sync; both apps reach
// the same MongoDB `customers` collection).
import mongoose, { Schema, model, models, type Model } from 'mongoose'

export interface ICustomer {
  _id?: mongoose.Types.ObjectId
  companyId?: mongoose.Types.ObjectId
  name: string
  phone: string
  email?: string
  passwordHash?: string
  status: 'active' | 'inactive' | 'banned'
  memberId?: string
  idProof?: string
  feedback?: string
  address?: string
  joinDate: Date
  trips: mongoose.Types.ObjectId[]
  totalRides: number
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema = new Schema<ICustomer>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'CompanyAdmin', required: false },
    name:      { type: String, required: true },
    phone:     { type: String, required: true, unique: true },
    email:     { type: String, required: false, sparse: true, unique: true },
    passwordHash: { type: String, required: false, select: false },
    status:    { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
    memberId:  { type: String, required: false },
    idProof:   { type: String, required: false },
    feedback:  { type: String, required: false },
    address:   { type: String, required: false },
    joinDate:  { type: Date, default: Date.now },
    totalRides:{ type: Number, default: 0 },
    trips:     [{ type: Schema.Types.ObjectId, ref: 'Trip', default: [] }],
  },
  { timestamps: true }
)

CustomerSchema.index({ companyId: 1, phone: 1 })

const Customer: Model<ICustomer> =
  (models.Customer as Model<ICustomer>) || model<ICustomer>('Customer', CustomerSchema)

export default Customer

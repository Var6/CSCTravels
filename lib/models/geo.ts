import { Schema } from 'mongoose'

/**
 * MIRROR of CSCBilling/models/geo.ts — both apps write the same `trips` and
 * `drivers` collections, so the geo shape must match exactly.
 *
 * Declaring the point inline as
 *
 *   location: { type: { type: String, default: 'Point' }, coordinates: [Number] }
 *
 * makes Mongoose materialise `{ type: 'Point' }` with no coordinates on every
 * document, even ones that never had a position. A 2dsphere index then rejects
 * the whole save with "Can't extract geo keys" — so an unrelated update fails
 * on any document that has never been given coordinates.
 *
 * A sub-schema with `default: undefined` means the subdocument simply does not
 * exist until coordinates are set, which a 2dsphere index happily skips.
 *
 * Coordinate order is [longitude, latitude] — the reverse of how it is spoken.
 */
export const PointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (v: number[]) =>
          Array.isArray(v) && v.length === 2 && Math.abs(v[0]) <= 180 && Math.abs(v[1]) <= 90,
        message: 'coordinates must be [longitude, latitude] within valid ranges',
      },
    },
  },
  { _id: false },
)

export const geoPoint = () => ({ type: PointSchema, default: undefined })

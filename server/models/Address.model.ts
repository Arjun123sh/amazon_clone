import mongoose, { Schema,Types } from "mongoose";

interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    country: string;
    owner: Types.ObjectId | string; // Assuming 'User' is the related model
    pincode: string;
    state: string;
  }
const addressSchema = new Schema<Address>(
  {
    addressLine1: {
      required: true,
      type: String,
    },
    addressLine2: {
      type: String,
    },
    city: {
      required: true,
      type: String,
    },
    country: {
      required: true,
      type: String,
    },
    owner: {
      ref: "User",
      type: Schema.Types.ObjectId,
    },
    pincode: {
      required: true,
      type: String,
    },
    state: {
      required: true,
      type: String,
    },
  },
  { timestamps: true }
);

export const Address = mongoose.model<Address>("addressSchema", addressSchema);

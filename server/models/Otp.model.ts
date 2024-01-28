import mongoose, { Schema } from "mongoose";

export interface Otp{
    email:string,
    otp:string,
    createdAt:Date,
}

const OtpSchemma=new Schema<Otp>({
    email:{
        type:String,
        required:true,
        trim:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
})

export const OtpSchema=mongoose.model<Otp>("OtpSchemma",OtpSchemma);
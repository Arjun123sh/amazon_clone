import mongoose,{Schema} from "mongoose";

interface User{
    name:string,
    email:string,
    role:string,
    password:string,
    isEmailVerified?:boolean,
    forgotPasswordToken?:string,
    forgotPasswordExpiry?:Date,
    emailVerificationToken?:string,
    emailVerificationExpiry?:string,
}

const userSchema = new Schema<User>(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      role: {
        type: String,
        enum: ['admin','user'],
        default: 'user',
        required: true,
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      forgotPasswordToken: {
        type: String,
      },
      forgotPasswordExpiry: {
        type: Date,
      },
      emailVerificationToken: {
        type: String,
      },
      emailVerificationExpiry: {
        type: Date,
      },
    },
    { timestamps: true }
);

export const Users=mongoose.model<User>("Users",userSchema);
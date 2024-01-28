import jwt from "jsonwebtoken";
import { User, Users } from "../models/Users.model";
import { OtpSchema, Otp } from "../models/Otp.model";
import bcrypt from "bcrypt";
import otpTemplate from "../templates/emailVerificationTemplate";
import * as otp_generator from "otp-generator";
import mailSender from "../config/SendMail.js";
import {  RequestHandler } from "express";
import { Response, Request } from "express";

const SendOtp: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        let otp = otp_generator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        })

        let result = await OtpSchema.findOne({ otp });

        while (result) {
            otp = otp_generator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            })
            result = await OtpSchema.findOne({ otp });
        }

        const response = await OtpSchema.create({
            email, otp
        })

        const mailResponse = await mailSender(email, "Verification Email from UrbanGrove", otpTemplate(otp));
        console.log("Mail response in auth ", mailResponse)
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully!!"
        })
    }
    catch (err: any) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

const CreateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { name, email, password, phoneNumber, otp } = req.body;
        //check if user already exists in the database
        const ExistingUser: User | null = await Users.findOne({
            $or: [
                { email: email },
                { phoneNumber: phoneNumber }
            ]
        })

        if (ExistingUser) {
            return res.status(500).json({
                status: false,
                message: "Email or Phone number is already registered",
            })
        }

        const recentOtp: Otp | null = await OtpSchema.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);
        console.log("Recent otp is ", recentOtp);

        if (!recentOtp) {
            return res.status(500).json({
                succcess: false,
                message: "OTP not found",
            })
        }

        if (otp !== recentOtp.otp) {
            return res.status(500).json({
                succcess: false,
                message: "OTP Do not match ",
            })
        }

        const HashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({
            email: email,
            phoneNumber: phoneNumber,
            name: name,
            password: HashedPassword,
        })

        return res.status(200).json({
            success: true,
            message: "User is registered Succcessfully",
            user
        })
    }
    catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: err.message,
            })
        }
    }
}

const LoginUser: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { email, phoneNumber, password } = req.body;

        if (!email || !password || !phoneNumber) {
            return res.status(500).json({
                success: false,
                message: 'Please provide an Email and Password',
            });
        }

        const User = await Users.findOne({
            $or: [
                { email: email },
                { phoneNumber: phoneNumber },
            ],
        });

        if (!User) {
            return res.status(500).json({
                success: false,
                message: 'User not found, You Need To Sign Up First',
            });
        } else {
            if (await bcrypt.compare(password, User.password)) {
                const payload = {
                    email: User.email,
                    id: User._id,
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET || '', {
                    expiresIn: '30d',
                });

                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 2);

                return res.cookie('token', token, {expires:expiryDate}).status(200).json({
                    success: true,
                    token,
                    User,
                    message: 'User Logged in Successfully',
                });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Wrong Password Entered',
                });
            }
        }
    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    }
};


export {
    CreateUser,
    LoginUser,
    SendOtp
}

import { Users } from "../models/Users.model";
import { Address } from "../models/Address.model";
import mongoose from "mongoose";
import { Request,Response } from "express";
import { AddressInterface, IUserRequest } from "../types";

const createAddress=async(req:AddressInterface,res:Response)=>{
    try{
        const id=req.user.id;
        const {addressLine1,addressLine2,city,country,pincode,state}=req.body;
        //check if user exists or not
        const UserExists=await Users.aggregate([
            {
                $match:{_id:new mongoose.Types.ObjectId(id)}
            }
        ])
        if(UserExists.length==0){
            return res.status(404).json({message:"Invalid User"})
        }
        else{
            const response=await Address.create({
                addressLine1,
                addressLine2,
                city,
                country,
                pincode,
                state,
                owner:id,
            })
            console.log("response",response);
            if(response){
                return res.status(200).json({
                    success:true
                })
            }
        }
    }
    catch(err){
        if(err instanceof Error){
            return res.status(500).json({
                success:false,
                message:err.message,
            })
        }
    }
}

const UpdateAddress=async(req:Request,res:Response)=>{
    try{
        const id:string=req.params.id ;
        const {addressLine1,addressLine2,city,country,pincode,state}=req.body;
        const response=await Address.findByIdAndUpdate(
            {_id:new mongoose.Types.ObjectId(id)},
            {
                $set:{
                    addressLine1,
                    addressLine2,
                    city,
                    country,
                    pincode,
                    state,
                }
            },{new:true}
        );
        console.log("Updated Address is ",response);
        if(response){
            return res.status(200).json({
                success: true,
                message:"Address Updated Successfully",
            })
        }
        else{
            return res.status(404).json({
                success: false,
                message:"Not Able to Update Address"
            })
        }
    }
    catch(err){
        if(err instanceof Error){
            return res.status(500).json({
                success:false,
                message:err.message,
            })
        }
    }
}

const getAddressById=async(req:IUserRequest,res:Response)=>{
    try{
        const userId=req.user.id;
        const response=await Address.findOne({owner:new mongoose.Types.ObjectId(userId)});
        if(response){
            return res.status(200).send({
                success:true,
                data:response,
            })
        }
    }
    catch(err){
        if(err instanceof Error){
            return res.status(500).json({
                success:false,
                message:err.message,
            })
        }
    }
}

const DeleteAddress=async(req:Request,res:Response)=>{
    try{
        const id:string=req.params.id;
        const response=await Address.findByIdAndDelete(new mongoose.Types.ObjectId(id));
        if(response) {
            return res.status(200).json({
                success:false,
                message:"Address Deleted Successfully",
            })
        }
    }
    catch(err){
        if(err instanceof Error){
            return res.status(500).json({
                success:false,
                message:err.message,
            })
        }
    }
}

export{
    createAddress,
    UpdateAddress,
    getAddressById,
    DeleteAddress,
}